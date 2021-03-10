import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Survey } from './Survey';
import { User } from './User';

@Entity('surveys_users')
class SurveyUser {
    @PrimaryColumn()
    readonly id: string;

    //@ManyToMany(type => User) @JoinTable()
    @Column()
    //user_id: User[];
    user_id: string;

   //@ManyToMany(type => Survey) @JoinTable()
    @Column()
    //survey_id: Survey[];
    survey_id: string;
    
    @CreateDateColumn()
    created_at: Date;

    @Column()
    value: string;

    constructor() {
        if(!this.id) this.id = uuid();
    }
}

export { SurveyUser };