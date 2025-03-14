import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { IotModule } from "./iot/iot.module";
import { AuthModule } from "./auth/auth.module";
import { MongoMemoryServer } from "mongodb-memory-server";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        // Check for Kubernetes deployment
        if (process.env.KUBERNETES_DEPLOYMENT === "true") {
          const uri =
            process.env.MONGODB_URI ||
            "mongodb://mongodb-service:27017/smartcity";
          console.log("Running in Kubernetes environment, connecting to:", uri);
          return { uri };
        }

        // Use MongoDB Memory Server in development to avoid database dependency
        if (process.env.MONGODB_USE_MEMORY_SERVER === "true") {
          const mongod = await MongoMemoryServer.create();
          const uri = mongod.getUri();
          console.log("Using MongoDB Memory Server:", uri);
          return { uri };
        }

        // Default connection for local development
        const uri =
          process.env.MONGODB_URI || "mongodb://localhost:27017/smart-city";
        console.log("Using standard MongoDB connection:", uri);
        return { uri };
      },
    }),
    IotModule,
    AuthModule,
  ],
})
export class AppModule {}
