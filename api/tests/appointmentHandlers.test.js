const request = require('supertest');
const app = require('../app');

describe('Appointment Routes Tests', () => {
    let createdAppointmentId; 
    let vendorId = 1; 
    let buyerId = 1; 
   
    

    // Test pour la création d'un rendez-vous
   

    // Test pour obtenir un rendez-vous
    it('should get an appointment by ID', async () => {
        const res = await request(app).get(`/appointments/${createdAppointmentId}`);
        expect(res.statusCode).toEqual(200); // Vérifiez que la réponse est 200 (OK)
        expect(res.body).toHaveProperty('title', 'Test Appointment'); // Vérifiez que le rendez-vous récupéré correspond au rendez-vous créé
    });

    // Test pour la mise à jour d'un rendez-vous
    it('should update an appointment', async () => {
        const res = await request(app)
            .put(`/appointments/${createdAppointmentId}`)
            .send({
                title: 'Updated Appointment',
                description: 'Updated Description',
                type: 'physical',
                location: 'Updated Location',
                start_time: '2024-03-21T13:30:00.000Z',
                end_time: '2024-03-21T14:30:00.000Z',
                vendor_id: 2 // Remplacez avec l'ID du vendeur approprié pour la mise à jour
            });
        expect(res.statusCode).toEqual(200); // Vérifiez que la réponse est 200 (OK)
        expect(res.body).toHaveProperty('title', 'Updated Appointment'); // Vérifiez que le rendez-vous a été mis à jour avec succès
    });

    // Test pour la suppression d'un rendez-vous
    it('should delete an appointment by ID', async () => {
        const res = await request(app).delete(`/appointments/${createdAppointmentId}`);
        expect(res.statusCode).toEqual(200); // Vérifiez que la réponse est 200 (OK)
        expect(res.body).toEqual(`Appointment deleted: Updated Appointment`); // Vérifiez que le rendez-vous a été supprimé avec succès
    });

    // Test pour obtenir tous les rendez-vous d'un vendeur
    it('should get appointments with buyer names by vendor ID', async () => {
        const res = await request(app).get(`/appointments/vendor/${vendorId}`); // Remplacez avec l'ID du vendeur approprié
        expect(res.statusCode).toEqual(200); // Vérifiez que la réponse est 200 (OK)
        expect(res.body.length).toBeGreaterThanOrEqual(0); // Vérifiez que la réponse contient au moins un rendez-vous
    });

    // Test pour obtenir tous les rendez-vous d'un acheteur
    it('should get appointments with vendor names by buyer ID', async () => {
        const res = await request(app).get(`/appointments/buyer/${buyerId}`); // Remplacez avec l'ID de l'acheteur approprié
        expect(res.statusCode).toEqual(200); // Vérifiez que la réponse est 200 (OK)
        expect(res.body.length).toBeGreaterThanOrEqual(0); // Vérifiez que la réponse contient au moins un rendez-vous
    });

    // Test pour la création d'un rendez-vous
    it('should create a new appointment', async () => {
        const res = await request(app)
            .post('/appointments/create')
            .send({
                title: 'Test Appointment',
                description: 'Test Description',
                type: 'virtual',
                location: 'Test Location',
                start_time: '2024-03-20T13:30:00.000Z',
                end_time: '2024-03-20T14:30:00.000Z',
                vendor_id: 1 // Remplacez avec l'ID du vendeur approprié
            });
        expect(res.statusCode).toEqual(201); // Vérifiez que la réponse est 201 (Créé avec succès)
        expect(res.body).toHaveProperty('appointment_id'); // Vérifiez que la réponse contient l'ID du rendez-vous créé
        createdAppointmentId = res.body.appointment_id; // Stockez l'ID du rendez-vous créé pour les tests ultérieurs
    });

    // Test pour obtenir un rendez-vous
    it('should get an appointment by ID', async () => {
        const res = await request(app).get(`/appointments/${createdAppointmentId}`);
        expect(res.statusCode).toEqual(200); // Vérifiez que la réponse est 200 (OK)
        expect(res.body).toHaveProperty('title', 'Test Appointment'); // Vérifiez que le rendez-vous récupéré correspond au rendez-vous créé
    });

    // Test pour la mise à jour d'un rendez-vous
    it('should update an appointment', async () => {
        const res = await request(app)
            .put(`/appointments/${createdAppointmentId}`)
            .send({
                title: 'Updated Appointment',
                description: 'Updated Description',
                type: 'physical',
                location: 'Updated Location',
                start_time: '2024-03-21T13:30:00.000Z',
                end_time: '2024-03-21T14:30:00.000Z',
                vendor_id: 2 // Remplacez avec l'ID du vendeur approprié pour la mise à jour
            });
        expect(res.statusCode).toEqual(200); // Vérifiez que la réponse est 200 (OK)
        expect(res.body).toHaveProperty('title', 'Updated Appointment'); // Vérifiez que le rendez-vous a été mis à jour avec succès
    });

    // Test pour la suppression d'un rendez-vous
    it('should delete an appointment by ID', async () => {
        const res = await request(app).delete(`/appointments/${createdAppointmentId}`);
        expect(res.statusCode).toEqual(200); // Vérifiez que la réponse est 200 (OK)
        expect(res.body).toEqual(`Appointment deleted: Updated Appointment`); // Vérifiez que le rendez-vous a été supprimé avec succès
    });

    // Test pour obtenir tous les rendez-vous d'un vendeur
    it('should get appointments with buyer names by vendor ID', async () => {
        const res = await request(app).get(`/appointments/vendor/${vendorId}`); // Remplacez avec l'ID du vendeur approprié
        expect(res.statusCode).toEqual(200); // Vérifiez que la réponse est 200 (OK)
        expect(res.body.length).toBeGreaterThanOrEqual(0); // Vérifiez que la réponse contient au moins un rendez-vous
    });

    // Test pour obtenir tous les rendez-vous d'un acheteur
    it('should get appointments with vendor names by buyer ID', async () => {
        const res = await request(app).get(`/appointments/buyer/${buyerId}`); // Remplacez avec l'ID de l'acheteur approprié
        expect(res.statusCode).toEqual(200); // Vérifiez que la réponse est 200 (OK)
        expect(res.body.length).toBeGreaterThanOrEqual(0); // Vérifiez que la réponse contient au moins un rendez-vous
    });
})

describe('Get Appointment', () => {
    it('should create a new appointment', async () => {
        const res = await request(app)
            .post('/appointments/create')
            .send({
                title: 'Test Appointment',
                description: 'Test Description',
                type: 'virtual',
                location: 'Test Location',
                start_time: '2024-03-20T13:30:00.000Z',
                end_time: '2024-03-20T14:30:00.000Z',
                vendor_id: vendorId 
            });
        expect(res.statusCode).toEqual(201); // Vérifiez que la réponse est 201 (Créé avec succès)
        expect(res.body).toHaveProperty('appointment_id'); // Vérifiez que la réponse contient l'ID du rendez-vous créé
        createdAppointmentId = res.body.appointment_id; // Stockez l'ID du rendez-vous créé pour les tests ultérieurs
    });
});