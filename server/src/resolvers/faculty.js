

export default {
    Query: {
        allFaculties: async(_, {}, { fastConn })=> {
            const faculties = await fastConn.models.Faculty.find();
            return faculties;
        }
    }
}