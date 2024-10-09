import { createServer, Model, Registry, Response, Server } from 'miragejs'
import { ModelDefinition } from 'miragejs/-types'
import Schema from 'miragejs/orm/schema'

interface RoomAttributes {
  number: string;
  type: string;
  status: string;
  rate: number;
  capacity: number;
}

interface GuestAttributes {
  name: string;
  email: string;
  phone: string;
}

interface ReservationAttributes {
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalAmount: number;
}

interface InvoiceAttributes {
  reservationId: string;
  amount: number;
  status: string;
}

interface SettingAttributes {
  key: string;
  value: string;
}

type AppRegistry = Registry<{
  room: ModelDefinition<RoomAttributes>;
  guest: ModelDefinition<GuestAttributes>;
  reservation: ModelDefinition<ReservationAttributes>;
  invoice: ModelDefinition<InvoiceAttributes>;
  setting: ModelDefinition<SettingAttributes>;
}, {}>

export function makeServer({ environment = 'development' } = {}): Server<AppRegistry> {
  return createServer({
    environment,

    models: {
      room: Model.extend<RoomAttributes>({}),
      guest: Model.extend<GuestAttributes>({}),
      reservation: Model.extend<ReservationAttributes>({}),
      invoice: Model.extend<InvoiceAttributes>({}),
      setting: Model.extend<SettingAttributes>({}),
    },

    seeds(server) {
      server.create('room', { number: '101', type: 'Single', status: 'available', rate: 100, capacity: 1 } as RoomAttributes);
      server.create('room', { number: '102', type: 'Double', status: 'occupied', rate: 150, capacity: 2 } as RoomAttributes);
      server.create('guest', { name: 'John Doe', email: 'john@example.com', phone: '1234567890' } as GuestAttributes);
      server.create('reservation', { 
        guestId: '1', 
        roomId: '1', 
        checkIn: '2023-06-01', 
        checkOut: '2023-06-05', 
        status: 'confirmed',
        totalAmount: 400
      } as ReservationAttributes);
    },

    routes() {
      this.namespace = 'api'

      this.get('/rooms', (schema: Schema<AppRegistry>) => {
        return schema.all('room')
      })

      this.get('/rooms/:id', (schema: Schema<AppRegistry>, request) => {
        const id = request.params.id
        return schema.find('room', id)
      })

      this.post('/rooms', (schema: Schema<AppRegistry>, request) => {
        const attrs = JSON.parse(request.requestBody)
        return schema.create('room', attrs)
      })

      this.put('/rooms/:id', (schema: Schema<AppRegistry>, request) => {
        const id = request.params.id
        const attrs = JSON.parse(request.requestBody)
        const room = schema.find('room', id)
        return room?.update(attrs) || new Response(404, {}, { errors: ['Room not found'] })
      })

      this.get('/guests', (schema: Schema<AppRegistry>) => {
        return schema.all('guest')
      })

      this.get('/guests/:id', (schema: Schema<AppRegistry>, request) => {
        const id = request.params.id
        return schema.find('guest', id)
      })

      this.post('/guests', (schema: Schema<AppRegistry>, request) => {
        const attrs = JSON.parse(request.requestBody)
        return schema.create('guest', attrs)
      })

      this.put('/guests/:id', (schema: Schema<AppRegistry>, request) => {
        const id = request.params.id
        const attrs = JSON.parse(request.requestBody)
        const guest = schema.find('guest', id)
        return guest?.update(attrs) || new Response(404, {}, { errors: ['Guest not found'] })
      })

      this.get('/reservations', (schema: Schema<AppRegistry>) => {
        return schema.all('reservation')
      })

      this.get('/reservations/:id', (schema: Schema<AppRegistry>, request) => {
        const id = request.params.id
        return schema.find('reservation', id)
      })

      this.post('/reservations', (schema: Schema<AppRegistry>, request) => {
        const attrs = JSON.parse(request.requestBody)
        return schema.create('reservation', attrs)
      })

      this.put('/reservations/:id', (schema: Schema<AppRegistry>, request) => {
        const id = request.params.id
        const attrs = JSON.parse(request.requestBody)
        const reservation = schema.find('reservation', id)
        return reservation?.update(attrs) || new Response(404, {}, { errors: ['Reservation not found'] })
      })

      this.patch('/reservations/:id', (schema: Schema<AppRegistry>, request) => {
        const id = request.params.id
        const attrs = JSON.parse(request.requestBody)
        const reservation = schema.find('reservation', id)
        return reservation ? reservation.update(attrs) : new Response(404, {}, { errors: ['Reservation not found'] })
      })

      this.get('/invoices', (schema: Schema<AppRegistry>) => {
        return schema.all('invoice')
      })

      this.get('/invoices/:id', (schema: Schema<AppRegistry>, request) => {
        const id = request.params.id
        return schema.find('invoice', id)
      })

      this.post('/invoices', (schema: Schema<AppRegistry>, request) => {
        const attrs = JSON.parse(request.requestBody)
        return schema.create('invoice', attrs)
      })

      this.put('/invoices/:id', (schema: Schema<AppRegistry>, request) => {
        const id = request.params.id
        const attrs = JSON.parse(request.requestBody)
        const invoice = schema.find('invoice', id)
        return invoice?.update(attrs) || new Response(404, {}, { errors: ['Invoice not found'] })
      })

      this.patch('/invoices/:id', (schema: Schema<AppRegistry>, request) => {
        const id = request.params.id
        const attrs = JSON.parse(request.requestBody)
        const invoice = schema.find('invoice', id)
        return invoice ? invoice.update(attrs) : new Response(404, {}, { errors: ['Invoice not found'] })
      })

      this.get('/settings', (schema: Schema<AppRegistry>) => {
        return schema.first('setting')
      })

      this.put('/settings', (schema: Schema<AppRegistry>, request) => {
        const attrs = JSON.parse(request.requestBody)
        const setting = schema.first('setting')
        return setting?.update(attrs) || new Response(404, {}, { errors: ['Settings not found'] })
      })
    },
  })
}