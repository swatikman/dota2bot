
interface UserRepository {
    getUserId(userTelegramId: number);
    
    save(user);

    findUser(id: number);
}

export { UserRepository }