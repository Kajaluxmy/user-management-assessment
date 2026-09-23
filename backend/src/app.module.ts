import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(
      (process.env.MONGO_URI || '').trim().replace(/^["']|["']$/g, ''),
    ),

    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}