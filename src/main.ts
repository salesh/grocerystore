import { NestFactory } from "@nestjs/core";
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
import { up, database } from "migrate-mongo";
import { AppModule } from "./app.module";

dotenv.config();
const logger = console;
const port = process.env.PORT ?? 3000;

async function runMigrations() {
  try {
    logger.log(`Running database migration...`);
    const { db, client } = await database.connect();
    const migrations = await up(db, client);
    if (migrations) {
      logger.log(`Successfully migrated ${migrations.length} migrations up`);
    } else {
      logger.log(`No migrations performed`);
    }
  } catch (e) {
    logger.error("Database migration failed", e);
    process.exit(1);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: true,
    methods: 'GET,PUT,POST,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, x-file-type',
    exposedHeaders: '*, Authorization'
  });
  app.use(
    bodyParser.json({
      limit: '10mb'
    })
  )
  await app.listen(port);
  console.log(`Process is listening on ${port}: pid=${process.pid}`);
}
bootstrap();

runMigrations();
