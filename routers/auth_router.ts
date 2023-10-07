import express from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/auth_controller";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *  post:
 *    summary: registers a new user
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/FullUser'
 *    responses:
 *      200:
 *        description: Registration successful
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/FullUser'
 *      400:
 *        description: Registration failed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: login with a registerd user
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserCredentials'
 *    responses:
 *      200:
 *        description: Login successful
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Tokens'
 *      400:
 *        description: Login failed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/refresh:
 *  get:
 *    summary: get a new access token using the refresh token
 *    tags: [Auth]
 *    description: need to provide the refresh token
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: tokens refreshed successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Tokens'
 *      401:
 *        description: Authentication missing
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      403:
 *        description: Authentication failed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.get("/refresh", refresh);

/**
 * @swagger
 * /auth/logout:
 *  get:
 *    summary: logout a user
 *    tags: [Auth]
 *    description: need to provide the refresh token
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: logout completed successfully
 *      403:
 *        description: Authentication failed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.get("/logout", logout);

export default router;

//////////////////////////////////////////////

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Authentication API
 *
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *
 *  schemas:
 *    FullUser:
 *      type: object
 *      required:
 *        - username
 *        - email
 *        - password
 *      properties:
 *        username:
 *          type: string
 *          description: The user's displayed name
 *        email:
 *          type: string
 *          description: The user's email
 *        password:
 *          type: string
 *          description: The user's password
 *      example:
 *        username: 'bob'
 *        email: 'bob@gmail.com'
 *        password: '123456'
 *
 *    UserCredentials:
 *      type: object
 *      required:
 *        - identifier
 *        - password
 *      properties:
 *        identifier:
 *          type: string
 *          description: The user's unique identifier; email or username
 *        password:
 *          type: string
 *          description: The user's password
 *      example:
 *        identifier: 'bob@gmail.com'
 *        password: '123456'
 *
 *    Tokens:
 *      type: object
 *      required:
 *        - accessToken
 *        - refreshToken
 *      properties:
 *        accessToken:
 *          type: string
 *          description: The JWT access token
 *        refreshToken:
 *          type: string
 *          description: The JWT refresh token
 *      example:
 *        accessToken: '123cd123x1xx1'
 *        refreshToken: '134r2134cr1x3c'
 *
 *    Error:
 *      type: object
 *      required:
 *        - status
 *        - message
 *      properties:
 *        status:
 *          type: string
 *          description: The requests status
 *        message:
 *          type: string
 *          description: The description of the error
 *      example:
 *        status: 'failed'
 *        message: 'username missing'
 */
