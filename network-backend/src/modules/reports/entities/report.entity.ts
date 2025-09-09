import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
} from 'typeorm';
import { Post } from '@/modules/posts/entities/post.entity';
import { User } from '@/modules/users/entities/user.entity';

export enum ReportStatus {
    PENDING = 'pending',
    REVIEWED = 'reviewed',
    RESOLVED = 'resolved',
}

export enum ReportType {
    POST = 'post',
    COMMENT = 'comment',
    USER = 'user',
}

@Entity({ name: 'reports' })
export class Report {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.reportsMade, { onDelete: 'CASCADE', nullable: true })
    reporter?: User;

    @ManyToOne(() => Post, (post) => post.reports, { nullable: true, onDelete: 'CASCADE'})
    post?: Post;

    @Column({ type: 'text', nullable: false })
    reason: string;

    @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
    status: ReportStatus;

    @Column({ type: 'enum', enum: ReportType, default: ReportType.POST })
    type: ReportType;

    @Column({ type: 'jsonb', nullable: true, name: 'ai_analysis' })
    aiAnalysis?: {
        predictions: Array<{
            label: string;
            probability: number;
        }>;
        reviewedAt: Date;
        modelVersion: string;
    };

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date;

    updateFromPrediction(predictionData: any): void {
        this.aiAnalysis = {
            predictions: predictionData.predictions.map((p: any) => ({
                label: p.label,
                probability: p.probability
            })),
            reviewedAt: new Date(),
            modelVersion: 'v1.0'
        };

        // this.autoUpdateStatus();
    }

    getHighestScore(): number {
        return Math.max(...this.aiAnalysis!.predictions.map(p => p.probability));
    }

    getPredictedLabel(): string {
        return this.aiAnalysis!.predictions.reduce(
            (max, pred) => pred.probability > max.probability ? pred : max,
            this.aiAnalysis!.predictions[0]
        ).label;
    }

    getScoreByLabel(label: string): number {
        return this.aiAnalysis!.predictions.find(p => p.label === label)?.probability || 0;
    }

    private autoUpdateStatus(): void {
        const highestLabel = this.getPredictedLabel();
        const highestScore = this.getHighestScore();

        if (highestLabel !== 'NotHate' && highestLabel !== 'Non-Violence' && highestScore > 90) {
            this.status = ReportStatus.REVIEWED;
        }

    }
}
