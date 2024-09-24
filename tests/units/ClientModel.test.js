const Client = require('../../models/Client');
const RequiredFieldException = require('../../error/RequiredFieldException');
const InvalidFieldException = require('../../error/InvalidFieldException');
const UserExistsException = require('../../error/UserExistsException');
// const { Model } = require('sequelize');

/*
jest.mock('../../models/Client', () => {
    return {
        create: jest.fn(),
    };
});
*/

// jest.spyOn(Model, 'create');
describe('Integração - Testando Client.create', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    xit('deve cadastrar um cliente com sucesso e retornar o id', async () => {
        const values = {
            name: 'Duca',
            email: 'duca@teste.com',
            password: 'Senha123!',
            confirmPassword: 'Senha123!'
        };

        Client.create.mockResolvedValue({
            id: 1,
            email: values.email,
            name: values.name
        });

        const result = await Client.create(values);

        expect(result).toEqual({
            id: 1,
            email: values.email,
            name: values.name
        });
    });

    it('deve lançar erro se o campo "Nome" for obrigatório', async () => {
        const values = {
          email: 'duca@teste.com',
          password: 'Senha123!',
          confirmPassword: 'Senha123!'
        };

        try {
            const res = await Client.create(values);
            console.log(res);

            expect(false).toBe(true);
        } catch (error) {
          console.log(error);
            expect(error).toBeInstanceOf(RequiredFieldException);
            expect(error.message).toBe('Field name is required');
        }
    });

    xit('deve lançar erro se o campo "Email" for obrigatório', async () => {
        const values = {
          name: 'Duca',
          password: 'Senha123!',
          confirmPassword: 'Senha123!'
        };

        try {
            await Client.create(values);
        } catch (error) {
            expect(error).toBeInstanceOf(RequiredFieldException);
            expect(error.message).toBe('Field email is required');
        }
    });

    xit('deve lançar erro se o email for inválido', async () => {
        const values = {
          name: 'Duca',
          email: 'emailerrado',
          password: 'Senha123!',
          confirmPassword: 'Senha123!'
        };

        try {
            await Client.create(values);
           
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidFieldException);
            expect(error.message).toBe('Field is invalid');
        }
    });

    xit('deve lançar erro se a senha e a confirmação de senha forem diferentes', async () => {
        const values = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'Senha1234!',
            confirmPassword: 'Senha12345!'
        };

        try {
            await Client.create(values);
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidFieldException);
            expect(error.message).toBe('Field is invalid');
        }
    });

    xit('deve lançar erro ao tentar cadastrar um cliente já existente', async () => {
        const values = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'securepassword',
            confirmPassword: 'securepassword'
        };

        Client.create.mockResolvedValueOnce({
            id: 1,
            email: values.email,
            name: values.name
        });

        Client.create.mockRejectedValueOnce(new UserExistsException(values.email));

        await Client.create(values);

        try {
            await Client.create(values);
        } catch (error) {
            expect(error).toBeInstanceOf(UserExistsException);
            expect(error.message).toBe('User already exists');
        }
    });
});
