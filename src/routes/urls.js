import { Router } from 'express'
import bcrypt from 'bcrypt'
import multer from 'multer'

import pool from '../utils/db.js'
import tokenGenerator from '../utils/tokengen.js'
import authorization from '../utils/authorization.js'

const router = Router()

const upload = multer({
    limits: {
      fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
      if (file.mimetype !== "image/jpeg") {
        cb(new Error("Please upload a jpeg file"));
      }
      cb(undefined, true);
    },
  });

// homepage
router.get('/', (req, res) => {
    res.render("./index")
})

router.get('/admin', (req, res) => {
    res.render('./login', { pageTitle: 'Login', currentPage: '/login' })
})

router.post('/admin', async (req, res) => {
    try {
        // destructure body
        const { username, password } = req.body

        // check if email exists
        const admin_query = await pool.query("SELECT * FROM administrators WHERE username = $1", [username])
        if (admin_query.rows.length === 0) {
            throw 'User does not exist'
        }
        else {
            // user exists. check password of that account
            // decrypt password
            const validPassword = await bcrypt.compare(password, admin_query.rows[0].password)
            console.log('password passed test')

            // is password correct
            if (!validPassword) { throw 'Invalid Password' }
            else {
                const token = tokenGenerator(admin_query.rows[0].id)
                res.cookie("token", token, { httpOnly: true });
                res.redirect('/dashboard')
            }
        }

    } catch (err) {
        console.error(err)
        res.redirect("/admin")
    }
})

router.get('/dashboard', authorization, async (req, res) => {
    try {
        // get all portfolios
        const query = await pool.query("SELECT pfolio.*, (SELECT COUNT(photos.image) FROM photos WHERE photos.pfolio_id = pfolio.id) AS images FROM pfolio")
        const all_pfolios = query.rows

        res.render('./dashboard', { all_pfolios })
    } catch (err) {
        console.error(err)
        res.redirect("/dashboard")
    }
})

router.post('/add_pfolio', authorization, async (req, res) => {
    try {
        // destructure req.body
        const { pfolio_name } = req.body

        // check if name exists
        const pfolio_query = await pool.query("SELECT * FROM pfolio WHERE pfolio_name = $1", [pfolio_name])
        if (pfolio_query.rows.length === 0) {
            // it does not exist, craete it now
            await pool.query("INSERT INTO pfolio (pfolio_name) VALUES ($1)", [pfolio_name])
            res.redirect('/dashboard')
        } else {
            throw "Portfolio already exists"
        }

    } catch (err) {
        console.log(err.message)
        res.redirect("/dashboard")
    }
})

router.post('/delete/:pfolio_id', authorization, async (req, res) => {
    try {
        const { pfolio_id } = req.params
        await pool.query("DELETE FROM pfolio WHERE pfolio.id = $1", [pfolio_id])
        res.redirect("/dashboard")
    } catch (err) {
        console.log(err.message)
        res.redirect("/dashboard")
    }
})

router.post('/update/:pfolio_id', authorization, async (req, res) => {
    try {
        const { pfolio_name } = req.body
        const { pfolio_id } = req.params
        await pool.query("UPDATE pfolio SET pfolio_name = $1 WHERE id = $2", [pfolio_name, pfolio_id])
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err.message)
        res.redirect('/dashboard')
    }
})

router.post('/add_image', authorization, async (req, res) => {
    try {
        // get name and image
        const { pfolio_name } = req.body

    } catch (err) {
        console.log(err.message)
        res.redirect('/dashboard')
    }
})

export default router