import express from "express";
import {
  register,
  changePassword,
  changeEmail,
  changeUsername,
  login,
  authenticate,
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
 * /auth/change/password:
 *  post:
 *    summary: Change password
 *    tags: [Auth]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Passwords'
 *    responses:
 *      200:
 *        description: Password changed successfully
 *      400:
 *        description: Password change failed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post("/change/password", authenticate, changePassword);

/**
 * @swagger
 * /auth/change/email:
 *  post:
 *    summary: Change email
 *    tags: [Auth]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *            properties:
 *              email:
 *                type: string
 *                description: The new email address to replace the current one
 *            example:
 *              email: 'bob@gmail.com'
 *      200:
 *        description: Email changed successfully
 *      400:
 *        description: Email change failed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post("/change/email", authenticate, changeEmail);

/**
 * @swagger
 * /auth/change/username:
 *  post:
 *    summary: Change username
 *    tags: [Auth]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - username
 *            properties:
 *              username:
 *                type: string
 *                description: The new username to replace the current one
 *            example:
 *              username: 'bobi'
 *      200:
 *        description: Username changed successfully
 *      400:
 *        description: Username change failed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post("/change/username", authenticate, changeUsername);

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
 *              $ref: '#/components/schemas/AuthInfo'
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
 *              $ref: '#/components/schemas/AuthInfo'
 *      401:
 *        description: Authentication missing
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      403:
 *        description: Authentication failed/ jwt expired
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
 *      401:
 *        description: Authentication missing
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      403:
 *        description: Authentication failed/ jwt expired
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
 *    AuthInfo:
 *      type: object
 *      required:
 *        - userId
 *        - email
 *        - username
 *        - accessToken
 *        - refreshToken
 *      properties:
 *        userId:
 *          type: string
 *          description: The User's ID
 *        email:
 *          type: string
 *          description: The User's email address
 *        username:
 *          type: string
 *          description: The User's username
 *        accessToken:
 *          type: string
 *          description: The JWT access token
 *        refreshToken:
 *          type: string
 *          description: The JWT refresh token
 *      example:
 *        userId: '123asdg87g8s'
 *        email: 'user@gmail.com'
 *        username: 'user'
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
