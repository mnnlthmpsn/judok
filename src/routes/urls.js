import { Router } from 'express'

const router = Router()

// homepage
router.get('/', (req, res) => {
    res.render("./index", {template: "home", pageTitle: "Welcome", currentPage: '/', test: [1,2,3,4]})
})

router.get('/blog', (req, res) => {
    res.render('./index', {template: 'blog', pageTitle: 'Blog', currentPage: '/blog'})
})

router.get('/contact', (req, res) => {
    res.render("./index", { template: "contact", pageTitle: "Contact Us", currentPage: '/contact' })
})

router.get('/company/:company_id', (req, res) => {
    res.render("./index", {template:'company', pageTitle: "JK Interior Decor", currentPage: '/decor'})
})

router.get('/admin', (req, res) => {
    res.render('./login', { pageTitle: 'Login', currentPage: '/login' } )
})
export default router