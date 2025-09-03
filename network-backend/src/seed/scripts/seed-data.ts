import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '@/modules/users/entities/user.entity';
import { Profile } from '@/modules/profiles/entities/profile.entity';
import { Follow, FollowStatus } from '@/modules/follows/entities/follow.entity';
import { BcryptService } from '@/modules/auth/bcrypt.service';

interface SeedData {
    users: any[];
    profiles: any[];
}

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);
    const bcryptService = app.get(BcryptService);

    // ✅ Đảm bảo luôn lấy đúng file JSON từ root project
    const dataPath = path.resolve(process.cwd(), 'src/seed/data/users-profiles-data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const seedData: SeedData = JSON.parse(rawData);

    try {
        await dataSource.transaction(async (transactionalEntityManager) => {
            console.log('Bắt đầu insert dữ liệu...');

            // Hash passwords trước
            const usersWithHashedPasswords = await Promise.all(
                seedData.users.map(async (user) => ({
                    ...user,
                    password: await bcryptService.hash(user.password),
                })),
            );

            // Insert Users
            console.log(`Inserting ${usersWithHashedPasswords.length} users...`);
            const savedUsers: User[] = [];
            for (const userData of usersWithHashedPasswords) {
                const user = transactionalEntityManager.create(User, userData);
                const savedUser = await transactionalEntityManager.save(User, user);
                savedUsers.push(savedUser);
                // console.log(`   ✔ Created user: ${savedUser.username} (ID: ${savedUser.id})`);
            }

            // Insert Profiles
            console.log(`Inserting ${seedData.profiles.length} profiles...`);
            const savedProfiles: Profile[] = [];
            for (let i = 0; i < savedUsers.length; i++) {
                const baseProfileData = seedData.profiles[i] || {
                    bio: '',
                    avatar: null,
                };

                const profileData = {
                    ...baseProfileData,
                    user: savedUsers[i],
                };

                const profile = transactionalEntityManager.create(Profile, profileData);
                const savedProfile = await transactionalEntityManager.save(Profile, profile);
                savedProfiles.push(savedProfile);
                console.log(`   ✔ Created profile for user: ${savedUsers[i].username}`);
            }


            // Insert Follows (Random)
            console.log(`Random inserting follows...`);
            const allProfiles = await transactionalEntityManager.find(Profile);

            const numberOfFollows = 50;
            const createdFollows: Follow[] = [];

            for (let i = 0; i < numberOfFollows; i++) {
                const follower = allProfiles[Math.floor(Math.random() * allProfiles.length)];
                let following = follower;

                // đảm bảo không tự follow chính mình
                while (following.id === follower.id) {
                    following = allProfiles[Math.floor(Math.random() * allProfiles.length)];
                }

                // check cặp đã tồn tại chưa
                const exists = await transactionalEntityManager.findOne(Follow, {
                    where: {
                        follower: { id: follower.id },
                        following: { id: following.id },
                    },
                });

                if (!exists) {
                    const follow = transactionalEntityManager.create(Follow, {
                        follower,
                        following,
                        status: FollowStatus.ACCEPTED,
                    });
                    await transactionalEntityManager.save(Follow, follow);
                    createdFollows.push(follow);
                    // console.log(`   ✔ Created follow: ${follower.user.username} -> ${following.user.username}`);
                } else {
                    i--;
                }
            }

            console.log(`Inserted ${createdFollows.length} follows successfully!`);
        });
    } catch (error) {
        console.error('Lỗi khi insert dữ liệu:', error);
    } finally {
        await app.close();
        process.exit(0);
    }
}

bootstrap();
