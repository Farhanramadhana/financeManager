import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { UserModule } from './api/v1/user/user.module';
import { AuthModule } from './api/v1/auth/auth.module';
import { FinanceAccount } from './entities/finance_account.entitiy';
import { Transaction } from './entities/transaction.entity';
import { Auth } from './entities/auth.entity';
import { FinanceModule } from './api/v1/finance/finance.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [User, FinanceAccount, Transaction, Auth],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    FinanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
