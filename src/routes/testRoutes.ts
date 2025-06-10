import express from "express";
const router = express.Router();

/**
 * @swagger
 * /test/ping:
 *   get:
 *     summary: Test route to check if API is up
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Pong!
 */
router.get("/ping", (req, res) => {
    res.json({ message: "pong" });
});

export default router;
