import { User } from '@/modules/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Entity({ name: 'user_recommendations' })
@Unique(['user', 'candidate'])
export class UserRecommendation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @ManyToOne(() => User, (user) => user.sentRecommendations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ApiProperty()
    @ManyToOne(() => User, (user) => user.receivedRecommendations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'candidate_id' })
    candidate: User;

    @ApiProperty()
    @Column({ type: 'jsonb', nullable: true })
    commonFeatures?: Record<string, any>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
