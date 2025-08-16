import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Profile } from "@/modules/profiles/entities/profile.entity";
import { Post } from "@/modules/posts/entities/post.entity";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /** Nội dung comment */
  @Column({ type: "varchar", length: 500 })
  content: string;

  /** Số lượng reply (cache) */
  @Column({ type: "int", default: 0 })
  repliesCount: number;

  /** Đã chỉnh sửa chưa */
  @Column({ default: false })
  isEdited: boolean;

  /** Được ghim bởi chủ post không */
  @Column({ default: false })
  isPinned: boolean;

  /** Người tạo comment */
  @ManyToOne(() => Profile, (profile) => profile.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "author_id" })
  author: Profile;

  /** Bài post gốc */
  @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id" })
  post: Post;

  /** Nếu là reply thì parent comment */
  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "parent_id" })
  parent: Comment | null;

  /** Danh sách reply */
  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  @ManyToOne(() => Profile, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "reply_to_id" })
  replyTo: Profile | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
