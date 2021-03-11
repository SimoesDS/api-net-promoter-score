import { Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveyRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";

class AnswerController {

    async execute(request: Request, response: Response) {
        const { value: recommendationNote } = request.params;
        const { s: idSurvey } = request.query;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = idSurvey && await surveysUsersRepository.findOne({
            id: String(idSurvey),
        });

        if(!surveyUser) {
            return response.status(400).json({
                error: 'Survey User does not exists!'
            });
        }

        surveyUser.value = Number(recommendationNote);

        await surveysUsersRepository.save(surveyUser);

        return response.json(surveyUser);
    }
}

export { AnswerController };
