import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SavePost } from "./entities/save-post.entity";
import { ProfilesModule } from "../profiles/profiles.module";
import { PostsModule } from "../posts/posts.module";
import { SavePostsController } from "./save-posts.controller";
import { SavePostsService } from "./save-posts.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([SavePost]),
    ProfilesModule,
    PostsModule,
  ],
  controllers: [SavePostsController],
  providers: [SavePostsService],
})
export class SavePostsModule { }
