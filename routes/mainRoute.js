import express from "express";
import fs from "fs/promises";
import path from "path";
const router = express.Router();
const DATA_FILE = path.join(import.meta.dirname,"..", "data", "urlStore");

const InsertData = async (data) => {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}
const loadlinks = async () => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        if (!data.trim()) {
            return {};
        }
        return JSON.parse(data);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            await fs.writeFile(DATA_FILE, JSON.stringify({}));
            return {};
        }
        else throw error;
    }
}

router.get("/", (req, res) => {
    res.sendFile(path.join(import.meta.dirname,"..", "views", "index.html"));
});
router.post("/links", async (req, res) => {
    try {
        const urlStore = await loadlinks();
        const { url, shortUrl } = req.body;
        console.log("data is:", { url, shortUrl });
        if (urlStore[shortUrl]) {
            res.send("Url already exist try new one ");
        }
        else {
            urlStore[shortUrl] = url;
            await InsertData(urlStore);
            // res.json({
            //     message: "URL received successfully",
            //     success: true
            // });
            // res.redirect("/links");
            res.redirect("/links");
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
})
router.get("/links", async (req, res) => {
    // try {
    //     const links = await loadlinks()
    //     res.json({
    //         data: links,
    //         success: true
    //     });

    // }
    // catch (err) {
    //     return res.status(500).send(err.message);
    // }

    res.sendFile(path.join(import.meta.dirname,"..", "views", "links.html"));

});

router.get("/details", async (req, res) => {
    try {
        const urls = await loadlinks();
        res.json({
            success: true,
            data: urls
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
router.get("/:shortUrl", async (req, res) => {

    const links = await loadlinks();
    const url = links[req.params.shortUrl];
    if (!url) {
        res.status(404).send("No url found");
    }
    else res.redirect(url);



})

export const mainRoute = router;