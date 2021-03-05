import { Request, Response} from 'express';

class UserController {
    async create(request: Request, response: Response) {
        const { body } = request;
        
        return response.json({
            message: 'Criou com sucesso!'
        })
    }
}

export { UserController };