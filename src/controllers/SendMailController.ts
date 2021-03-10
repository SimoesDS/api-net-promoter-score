import { Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveyRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;
        const pathTemplateNPS = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const userAlreadyExists = await usersRepository.findOne({ email });

        if (!userAlreadyExists) {
            return response.status(400).json({
                error: 'User does not exists!'
            });
        }

        const surveyAlreadyExists = await surveysRepository.findOne({ id: survey_id });

        if (!surveyAlreadyExists) {
            return response.status(400).json({
                error: 'Survey does not exists!'
            });
        }

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: { user_id: userAlreadyExists.id, value: null },
            relations: ['user', 'survey']
        });

        
        const contextTemplate = {
            name: userAlreadyExists.name,
            title: surveyAlreadyExists.title,
            description: surveyAlreadyExists.description,
            id: "",
            link: process.env.URL_MAIL
        };

        if(surveyUserAlreadyExists) {
            contextTemplate.id = surveyUserAlreadyExists.id;
            await SendMailService.execute(email, surveyAlreadyExists.title, contextTemplate, pathTemplateNPS);
            return response.json(surveyUserAlreadyExists);
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: userAlreadyExists.id,
            survey_id,
        });

        await surveysUsersRepository.save(surveyUser);
        contextTemplate.id = surveyUser.id;

        await SendMailService.execute(email, surveyAlreadyExists.title, contextTemplate, pathTemplateNPS);

        response.json(surveyUser);
    }
}

export { SendMailController };
