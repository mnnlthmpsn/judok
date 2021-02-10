import jwt from 'jsonwebtoken'
import 'dotenv/config.js'

const tokenGenerator = id => {
    const payload = {
        user: id
    }
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '12hr'})
}

export default tokenGenerator