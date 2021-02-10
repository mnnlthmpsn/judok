import { Router } from 'express'
import bcrypt from 'bcrypt'

import pool from '../utils/db.js'
import tokenGenerator from '../utils/tokengen.js'
import authorization from '../utils/authorization.js'

const router = Router()

// homepage
router.get('/', (req, res) => {
    res.render("./index", { template: "home", pageTitle: "Welcome", currentPage: '/', test: [1, 2, 3, 4] })
})

router.get('/blog', (req, res) => {
    res.render('./index', { template: 'blog', pageTitle: 'Blog', currentPage: '/blog' })
})

router.get('/contact', (req, res) => {
    res.render("./index", { template: "contact", pageTitle: "Contact Us", currentPage: '/contact' })
})

router.get('/company/:company_id', (req, res) => {
    res.render("./index", { template: 'company', pageTitle: "JK Interior Decor", currentPage: '/decor' })
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
            console.log('error occured on line 39')
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

router.get('/dashboard', authorization, (req, res) => {
    res.render('./dashboard')
})

export default router