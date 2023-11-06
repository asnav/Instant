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
 *        name: owner
 *        description: get only posts of a specific owner (optional).
 *        schema:
 *          type: string
 *        required: false
 *    summary: Request posts
 *    tags: [Post]
 *    description: get all posts or posts of a spesific owner specified by its username.
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
 *        description: the id of the requested post.
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
 *      404:
 *        description: post not found.
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
 *        - text
 *      properties:
 *        text:
 *          type: string
 *          description: The post's text
 *      example:
 *        text: 'text'
 *
 *    RetrievedPost:
 *      type: object
 *      required:
 *        - postId
 *        - text
 *        - ownerId
 *        - username
 *      properties:
 *        postId:
 *          type: string
 *          description: The post's id
 *        text:
 *          type: string
 *          description: The post's text
 *        ownerId:
 *          type: string
 *          description: the post's owner's id
 *        username:
 *          type: string
 *          description: the post's owner's username
 *      example:
 *        postId: '654928872fa620d727b1c18e'
 *        text: 'this is the post's text'
 *        ownerId: '6548d7e0b5552db03c4e0b58'
 *        username: 'human'
 */
