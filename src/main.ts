import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const isProd = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';
const prefix = isProd || isStaging ? 'api/transfer' : undefined;

async function bootstrap() {
  const logLevel: LogLevel[] = [ 'log', 'error', 'verbose', 'warn' ];
  const developLogLevel: LogLevel[] = isProd ? [] : [ 'debug' ];

  const port = Number(process.env.PORT) || 3000 ;
  const app = await NestFactory.create(AppModule, {
    logger: [ ...logLevel, ...developLogLevel ],
  });

  const { httpAdapter } = app.get(HttpAdapterHost);

  if (!isProd)
    app.enableCors({ exposedHeaders: 'X-Token' });

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));

  if (!!prefix)
    app.setGlobalPrefix(prefix);

  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  const swaggerOptions = new DocumentBuilder()
      .setTitle('Transfer Server')
      .setDescription('DQR Transfer for Bank')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(`${prefix ? `/${prefix}` : ''}/swagger`, app, document);

  await app.listen(port);

  console.log('******************************');
  console.log(`        SERVER STARTED        `);
  console.log(`    Listening on port ${port} `);
  console.log('******************************');

}

bootstrap();
