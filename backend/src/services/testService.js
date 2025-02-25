import { UserCourse } from '../models/associations.js';
import { Test } from '../models/associations.js';
import { registerAttempt } from './reportService.js';
import { Report } from '../models/associations.js';
import { Course } from '../models/associations.js';

async function releaseTest(userId, courseId) {
  try {
    // Verificar o progresso do curso
    const userCourse = await UserCourse.findOne({
      where: { userId, courseId },
    });

    if (!userCourse) {
      return { error: 'Usuário não está matriculado neste curso.' };
    }

    if (userCourse.progress < 100) {
      return { error: 'Test não liberada. O curso não foi concluído.' };
    }

    // Buscar a Test associada ao curso
    const test = await Test.findOne({
      where: { courseId },
      attributes: ['id', 'questoes', 'notaMinima'],
    });

    if (!test) {
      return { error: 'Test não encontrada para este curso.' };
    }

    return test;
  } catch (error) {
    console.error('Erro ao verificar liberação da Test:', error);
    throw error;
  }
}

async function takeTest(testId, userId, answers) {
  try {
    // Obter a prova e a nota mínima
    const test = await Test.findByPk(testId);

    if (!test) {
      return { error: 'Prova não encontrada.' };
    }

    const correctAnswers = test.questions.map((question) => question.correctAnswer);

    // Comparar as respostas
    let receivedGrade = 0;
    for (let i = 0; i < test.qntQuestions; i++) {
      if (answers[i] === correctAnswers[i]) {
        receivedGrade += 1;
      }
    }
    // Registrar a tentativa
    const report = await registerAttempt(userId, testId, receivedGrade);

    // Verificar se a nota atingiu a mínima
    if (receivedGrade >= test.minGrade) {
      return { message: 'Prova concluída com sucesso!', report };
    } else {
      return { message: 'Nota insuficiente. Tente novamente.', report };
    }
  } catch (error) {
    console.error('Erro ao realizar a prova:', error);
    throw error;
  }
}

async function getAttemptsByTest(userId, testId) {
  try {
    const reports = await Report.findAll({
      where: { userId, testId },
      order: [['attempt', 'ASC']], // Ordenar pelas tentativas em ordem crescente
    });

    return reports;
  } catch (error) {
    console.error('Erro ao obter tentativas:', error);
    throw error;
  }
}

async function createTest(data) {
  try {
    const { courseId, questions, qntQuestions, minGrade } = data;

    // Verificar se o curso existe
    const curso = await Course.findByPk(courseId);
    if (!curso) {
      return { error: 'Curso não encontrado.' };
    }

    // Validar número de questões
    if (questions.length !== qntQuestions) {
      return { error: 'A quantidade de questões não corresponde ao valor informado.' };
    }

    const test = await Test.findOne({ where: { courseId } })
    //Validar se a prova já existe nesse curso
    if (test) {
      return;
    };

    // Criar a prova
    const newTest = await Test.create({
      courseId,
      questions,
      qntQuestions,
      minGrade,
    });

    return { message: 'Prova criada com sucesso!', newTest };
  } catch (error) {
    console.error('Erro ao criar a prova:', error);
    throw error;
  }
}

async function getTestByCourseId(courseId) {
  try {
    // Buscar a prova associada ao courseId
    const test = await Test.findOne({
      where: { courseId },
      include: {
        association: 'course', // Nome da associação no modelo
        attributes: ['id', 'title', 'description'], // Apenas os campos necessários do curso
      },
    });

    if (!test) {
      return { message: 'Nenhuma prova encontrada para este curso.' };
    }

    return test;
  } catch (error) {
    console.error('Erro ao buscar a prova:', error);
    throw error;
  }
}

async function getTestByUserId(userId) {
  try {
    // Buscar a prova associada ao userId
    const test = await Test.findAll({
      where: { userId },
      include: {
        association: 'user', // Nome da associação no modelo
        attributes: ['id', 'name'], // Apenas os campos necessários do usuário
      },
    });
    if (!test) {
      return { message: 'Nenhuma prova encontrada para este usuário.' };
    }
    return test;
  } catch (error) {
    console.error('Erro ao buscar a prova:', error);
    throw error;
  }
}

export { releaseTest, takeTest, getAttemptsByTest, createTest, getTestByCourseId, getTestByUserId };