# Smart City Monitoring Platform by Mihir sen 21BEC0971

A comprehensive monitoring and management solution for smart city infrastructure, providing real-time visualization, analytics, and citizen engagement tools.


## Features

- **Real-time Monitoring**: Track IoT sensors across the city for air quality, traffic, water, weather, and more
- **Interactive Map**: Visualize sensor locations and data on a map with filtering capabilities
- **Analytics Dashboard**: View trends and insights with data visualization tools
- **Alerts System**: Real-time notifications for critical sensor readings and infrastructure issues
- **Citizen Portal**: Allow residents to report issues like potholes, broken street lights, etc.
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode Support**: Comfortable viewing in any lighting condition

## Technology Stack

### Frontend

- Next.js (React framework)
- TypeScript
- Tailwind CSS for styling
- Mapbox GL for maps
- Recharts for data visualization
- WebSockets for real-time updates

### Backend

- Node.js
- Express
- MongoDB for data storage
- Redis for caching
- WebSockets for real-time updates

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (v4+)
- Redis (optional, for enhanced performance)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/smart-city-platform.git
cd smart-city-platform
```

2. Install dependencies for both frontend and backend

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables

Create a `.env` file in the backend directory:

```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/smartcity
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

Create a `.env.local` file in the frontend directory:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

4. Start the development servers

For backend:

```bash
cd backend
npm run dev
```

For frontend:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:3001`.

## Using Docker

You can also run the entire application using Docker and Docker Compose:

```bash
docker-compose up -d
```

This will start the frontend, backend, MongoDB, and Redis services.

## API Documentation

The API documentation is available at `http://localhost:3001/api-docs` when the backend server is running. It's powered by Swagger UI and provides interactive documentation for all available endpoints.

Key API endpoints:

- `GET /iot/sensor-data` - Get all sensor data
- `GET /iot/sensor-data/:id` - Get data for a specific sensor
- `POST /iot/report-issue` - Submit a citizen report
- `GET /iot/alerts` - Get current alerts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Mapbox](https://www.mapbox.com/) for map visualization
- [Recharts](https://recharts.org/) for data visualization components
- [Lucide Icons](https://lucide.dev/) for beautiful SVG icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
