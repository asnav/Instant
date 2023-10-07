import express from "express";
import {
  get_posts,
  add_new_post,
  get_post_by_id,
  update_post,
} from "../controllers/post_controller.js";
import { authenticate } from "../controllers/auth_controller.js";

const router = express.Router();

/**
 * @swagger
 * /post:
 *  get:
 *    parameters:
 *      - in: query
 *        name: sender
 *        description: get only posts by a specific sender (optional).
 *        schema:
 *          type: string
 *        required: false
 *    summary: Request posts
 *    tags: [Post]
 *    description: to request a spesific post insert it's id as a path. if there is no post with the specified id a n empty array wil be returned. if no id is provided the server will retrieve all posts.
 *    responses:
 *      200:
 *        description: post/s retrieved.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/RetrievedPost'
 *      400:
 *        description: Request failed, the error message will be attached.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.get("/", get_posts);

/**
 * @swagger
 * /post/{id}:
 *  get:
 *    parameters:
 *      - in: path
 *        name: id
 *        description: the id of the requested post (optional).
 *        schema:
 *          type: string
 *        required: true
 *    summary: Request posts
 *    tags: [Post]
 *    description: get post by post-id
 *    responses:
 *      200:
 *        description: post retrieved.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/RetrievedPost'
 *      400:
 *        description: Request failed, the error message will be attached.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.get("/:id", get_post_by_id);

/**
 * @swagger
 * /post:
 *  post:
 *    summary: add a new post
 *    tags: [Post]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Post'
 *    responses:
 *      200:
 *        description: post uploaded successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RetrievedPost'
 *      400:
 *        description: post upload failed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post("/", authenticate, add_new_post);

/**
 * @swagger
 * /post/{id}:
 *  put:
 *    parameters:
 *      - in: path
 *        name: id
 *        description: the id of the post to be updated.
 *        schema:
 *          type: string
 *        required: true
 *    summary: update an existing post by id
 *    tags: [Post]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Post'
 *    responses:
 *      200:
 *        description: post updated successfully
 *      400:
 *        description: post update failed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      404:
 *        description: post not found
 *        content:
 *          application/json:
 *            schema:
 *              status: 'post not found'
 */
router.put("/:id", authenticate, update_post);

export default router;
/**
 * @swagger
 * tags:
 *  name: Post
 *  description: API for posting and requesting posts from the server
 *
 * components:
 *  schemas:
 *    Post:
 *      type: object
 *      required:
 *        - message
 *        - sender
 *      properties:
 *        message:
 *          type: string
 *          description: The post's content
 *        sender:
 *          type: string
 *          description: The username of the user who owns the post
 *      example:
 *        message: 'message'
 *        sender: 'bob'
 *
 *    RetrievedPost:
 *      type: object
 *      required:
 *        - message
 *        - sender
 *        - _id
 *        - __v
 *      properties:
 *        message:
 *          type: string
 *          description: The post's content
 *        sender:
 *          type: string
 *          description: The username of the user who owns the post
 *        _id:
 *          type: string
 *          description: the post's id
 *        __v:
 *          type: integer
 *          description: version of the document in the db
 *      example:
 *        message: 'message'
 *        sender: 'bob'
 *        _id: 652068d7522c8b946f994f93
 *        __v: 0
 */
