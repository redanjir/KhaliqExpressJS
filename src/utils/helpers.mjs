import bcrypt from 'bcrypt';

const saltrounds = 10;

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltrounds);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async(plain, hashed) =>{
    return await bcrypt.compare(plain, hashed);
} 