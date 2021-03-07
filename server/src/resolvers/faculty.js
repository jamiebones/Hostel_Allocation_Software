

export default {
    Query: {
        allFaculties: async(_, {}, {models})=> {
            const faculties = await models.Faculty.find();
            return faculties;
        }
    }
}