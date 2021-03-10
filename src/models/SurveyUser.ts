import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Survey } from './Survey';
import { User } from './User';

@Entity('surveys_users')
class SurveyUser {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    user_id: string;
    
    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    survey_id: string;
    
    @ManyToOne(type => Survey)
    @JoinColumn({ name: 'survey_id' })
    survey: Survey;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    value: string;

    constructor() {
        if(!this.id) this.id = uuid();
    }
}

export { SurveyUser };