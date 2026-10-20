# VigilantGear — MVP Specification

> **Project:** VigilantGear  
> **Tagline:** AI-Powered PPE Compliance Monitoring  
> **Document type:** MVP requirements, project structure, and technology specification  
> **Target:** College project / demonstrable MVP

## 1. Project Overview

VigilantGear is an AI-powered workplace safety monitoring application that detects workers and supported Personal Protective Equipment (PPE) in video and webcam frames. It helps safety managers review PPE compliance, inspect possible violations, and understand safety trends.

The MVP includes video upload and analysis, live webcam detection, annotated results, a dashboard, violation history, reports, and basic settings. AI detections can be incorrect; uncertain cases should be marked for human review rather than treated as definitive safety judgments.

## 2. MVP Goals

- Detect people and supported PPE classes using a PPE-trained YOLO model.
- Identify possible missing-PPE violations using explicit rules and confidence thresholds.
- Analyze uploaded videos and show processing progress.
- Detect PPE in a live webcam feed.
- Display bounding boxes, class labels, confidence scores, and compliance status.
- Save detection-event metadata and relevant snapshots for later review.
- Show dashboard statistics and violation categories.
- Search and filter detection history and export records to CSV.
- Keep the frontend, Express backend, and Python AI module separate for easier development and maintenance.

## 3. Functional Requirements

### 3.1 PPE Detection Using YOLO

- Run inference on sampled video frames and webcam frames.
- Detect `person`, `helmet`, and `safety_vest` when supported by the selected model.
- Add `gloves`, `goggles`, and `safety_boots` only if the model has been trained and evaluated for those classes.
- Return bounding boxes, class names, confidence scores, frame timestamps, and source identifiers.
- Apply configurable rules to classify results as compliant, violation, or uncertain.

**Model limitation:** A generic YOLO model does not automatically detect all PPE classes. Select a suitable PPE-trained model or train/fine-tune one using an appropriate dataset. Only display classes the chosen model actually supports.

### 3.2 Video Upload and Analysis

- Allow users to upload supported video formats such as MP4; other formats depend on installed codec and processing support.
- Validate file type and size on the backend. Use a configurable MVP upload limit, such as 200–500 MB.
- Show upload status and analysis progress.
- Sample frames at a configurable interval to keep processing manageable.
- Generate an annotated output video with detection boxes and status labels.
- Display the annotated video, summary counts, violation categories, and a timeline of selected detections.
- Track job states: `queued`, `processing`, `completed`, and `failed`.
- Show errors clearly and allow a failed job to be retried.

### 3.3 Live Webcam Detection

- Request webcam permission through the browser and show when the camera is active.
- Capture frames in the browser and send them to the backend/AI service at a controlled rate.
- Display bounding boxes, PPE labels, confidence scores, and status colors.
- Show live counters for detected people, compliant detections, violations, and uncertain detections.
- Provide Start Camera, Stop Camera, and Capture Frame controls.
- Handle denied permissions, unavailable cameras, and connection or inference errors.
- Stop webcam tracks when detection ends or the user leaves the page.

**MVP implementation:** Start with HTTP frame requests. Add WebSockets only if normal requests are not responsive enough.

### 3.4 Analytics Dashboard

Display date-filterable metrics based on saved detection records:

- Total detection events.
- Compliant detection events.
- Violation events.
- Uncertain events requiring review.
- Compliance percentage.
- Violation counts by category.
- A simple compliance/violation trend chart.
- Recent violations and their snapshots.

Unless person tracking is implemented, describe totals as detection events or detection instances—not unique workers.

### 3.5 Color-Coded Detection

- **Green — Compliant:** Required PPE appears to be present according to the configured rules.
- **Red — Violation:** The available evidence supports a missing required PPE item.
- **Yellow — Uncertain / Review:** Confidence is low, the worker or PPE is occluded, or the result is ambiguous.

Use a configurable confidence threshold. Failure to detect a PPE item does not always prove that the worker is not wearing it; account for occlusion and possible false negatives.

### 3.6 Detection Results and Violation History

Save the following information where available:

- Event ID and source type (`webcam` or `uploaded_video`).
- Related video-analysis job or webcam session.
- Event timestamp, video timestamp, and frame number.
- Violation category and status.
- Confidence score and model version.
- Snapshot file path.
- Optional review status, reviewer notes, and review timestamp.

Provide:

- Search and filters by date, violation type, status, and source.
- A detail view with snapshot, timestamp, confidence, and detected PPE.
- Pagination for result lists.
- CSV export of filtered records.
- A simple option to delete stored videos and snapshots when no longer needed.

### 3.7 Annotated Results

- Draw boxes around detected people/PPE and label them with class, confidence, and status.
- Show an annotated video preview when video processing completes.
- Show selected detection frames in a timeline.
- Let users inspect an individual detection event.
- Make incomplete processing and uncertain results visible.

### 3.8 Reports

For the MVP:

- Show a date-range summary of detection events, compliance percentage, and violation categories.
- Export filtered detection records to CSV.
- PDF reports are optional and should be added only if time permits.
- Clearly label demonstration/sample data; do not present mock values as measured model performance.

### 3.9 Authentication and Roles

- Support login and logout.
- Protect application pages and API endpoints.
- Use two basic roles: `admin` and `safety_manager`.
- Admin can manage users and settings.
- Safety manager can review detections, view analytics, and run analyses.
- Hash passwords with a standard password-hashing library if implementing authentication directly.
- Google/Microsoft login and complex role systems are not required for the initial MVP.

### 3.10 Settings

Include a simple settings page for:

- Organization and site name.
- Time zone.
- Detection confidence threshold.
- Enabled PPE classes supported by the model.
- Video frame-sampling interval.
- Optional sound alerts.
- Local file retention settings.

Multi-camera/CCTV management can remain out of scope for the first version.

## 4. Recommended Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js, React, JavaScript | Web application and pages |
| Styling | Tailwind CSS | Responsive interface |
| UI components | shadcn/ui or reusable React components | Forms, dialogs, cards, and tables |
| Charts | Recharts | Dashboard analytics |
| Backend | Node.js + Express.js | Authentication, REST APIs, business logic, database operations |
| AI module | Python + FastAPI | Separate inference and video-processing API |
| Object detection | Ultralytics YOLO with a PPE-trained model | Person and PPE detection |
| Video processing | OpenCV and FFmpeg | Frame extraction and annotated-video generation |
| Database | MongoDB | Users, jobs, detection events, and settings |
| MongoDB access | Mongoose | Models, validation, and indexes in Express |
| File storage | Local filesystem | Uploaded videos, annotated videos, and snapshots |
| API communication | REST/HTTP | Frontend-to-backend and backend-to-AI requests |
| Testing | pytest, Vitest / React Testing Library | Basic API, AI, and UI tests |
| Version control | Git + GitHub | Source control and collaboration |
| Optional local setup | Docker Compose | Run services consistently during development |

### Keep the MVP simple

- Use **MongoDB** for structured application data.
- Use the **local filesystem** for video and snapshot files.
- Do **not** add Amazon S3 for this college MVP.
- Do **not** add Redis, BullMQ, Kubernetes, or a separate message broker initially.
- Use a simple analysis-job record in MongoDB and status polling for progress.
- If long videos later block the backend or processing needs to run asynchronously, add a lightweight worker/queue as a future improvement.

Local file storage is appropriate for development and a single-machine demo. Files on a deployment platform may be temporary or non-persistent, so use persistent disk or object storage only if deployment requirements demand it.

## 5. Component Responsibilities

### Frontend — `frontend/`

- Provides login and the dashboard navigation.
- Contains Dashboard, Live Detection, Video Analysis, Detection Results, Violation History, Reports, and Settings pages.
- Uploads videos and displays analysis progress.
- Captures webcam frames and displays detection overlays.
- Calls the Express backend for application operations.

### Backend — `backend/`

- Owns login, authorization, request validation, and business logic.
- Connects to MongoDB through Mongoose.
- Receives and validates video uploads.
- Creates analysis-job records and exposes progress/results endpoints.
- Calls the AI module and stores returned detection metadata.
- Serves authorized access to videos and snapshots.
- Provides analytics, history filters, settings, and CSV export.
- Keeps database credentials and internal service configuration on the server.

### AI module — `ai-module/`

- Runs as a separate Python FastAPI application.
- Loads the PPE-trained YOLO model.
- Uses OpenCV/FFmpeg to sample video frames and generate annotated output.
- Performs inference and applies PPE compliance rules.
- Returns structured detection results, progress information, and output file references.
- Does not connect directly to MongoDB in the initial design; Express remains responsible for application data.

### Database — MongoDB

Use MongoDB for metadata and application records, not for storing large video files as ordinary documents.

Suggested collections:

- `users`
- `analysis_jobs`
- `detection_events`
- `system_settings`

### Local file storage

Suggested folders:

- `storage/uploads/` — original uploaded videos.
- `storage/annotated/` — processed videos.
- `storage/snapshots/` — selected detection frames.

Add the storage folder to `.gitignore`. Generate server-side filenames rather than trusting uploaded filenames, validate uploads, and restrict file access to authorized users.

## 6. Repository Structure

```text
VigilantGear/
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── live-detection/
│   │   ├── video-analysis/
│   │   ├── detection-results/
│   │   ├── violation-history/
│   │   ├── reports/
│   │   └── settings/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   └── package.json
├── ai-module/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── tests/
│   └── requirements.txt
├── storage/                 # local files; excluded from Git
│   ├── uploads/
│   ├── annotated/
│   └── snapshots/
├── docs/
├── .env.example
├── .gitignore
└── README.md
```

Keep separate dependency files for the frontend, backend, and AI module. Each component can be run and debugged independently.

## 7. Core MongoDB Collections

### `users`

- `_id`
- `name`
- `email` (unique)
- `passwordHash`
- `role` (`admin` or `safety_manager`)
- `isActive`
- `createdAt`

### `analysis_jobs`

- `_id`
- `createdBy` (user ID)
- `sourceType` (`uploaded_video` or `webcam`)
- `originalFilename`
- `inputPath`
- `annotatedPath`
- `status` (`queued`, `processing`, `completed`, `failed`)
- `progressPercent`
- `errorMessage`
- `createdAt`, `startedAt`, `completedAt`

### `detection_events`

- `_id`
- `jobId` (optional for standalone webcam events)
- `sourceType`
- `eventTimestamp`
- `videoTimestampMs` (optional)
- `frameNumber` (optional)
- `violationType` (optional for compliant events)
- `status` (`compliant`, `violation`, `uncertain`, `needs_review`)
- `confidence`
- `detectedObjects` (array of class names, scores, and bounding boxes)
- `snapshotPath` (optional)
- `modelVersion`
- `reviewNotes` (optional)
- `createdAt`

### `system_settings`

- `_id`
- `organizationName`
- `siteName`
- `timezone`
- `enabledPpeClasses`
- `confidenceThreshold`
- `frameSamplingInterval`
- `retentionDays`
- `updatedAt`

Add indexes for commonly filtered fields such as event timestamp, status, violation type, and job ID.

## 8. API Outline

The frontend calls the Express backend. Express calls the private FastAPI AI module.

### Frontend → Express backend

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/login` | Sign in |
| `POST` | `/api/auth/logout` | Sign out |
| `GET` | `/api/auth/me` | Get current user |
| `POST` | `/api/videos` | Upload a video and create an analysis job |
| `GET` | `/api/jobs/:jobId` | Get job status and progress |
| `GET` | `/api/jobs/:jobId/results` | Get analysis results |
| `GET` | `/api/jobs/:jobId/video` | Access annotated video |
| `POST` | `/api/live-detection/frame` | Submit a webcam frame for inference |
| `GET` | `/api/detections` | Filter and paginate detection events |
| `GET` | `/api/detections/:id` | Get detection details |
| `GET` | `/api/analytics/overview` | Get dashboard metrics |
| `GET` | `/api/analytics/trends` | Get chart data |
| `GET` | `/api/reports/export.csv` | Export filtered records |
| `GET` / `PATCH` | `/api/settings` | Read or update settings |

### Express backend → FastAPI AI module

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Check AI module health |
| `POST` | `/internal/detect-frame` | Run detection on one frame |
| `POST` | `/internal/analyze-video` | Process an uploaded video |
| `GET` | `/internal/jobs/:jobId` | Get AI job progress if the AI service tracks jobs |

These are suggested endpoints; define and validate the final request/response formats during implementation. Keep the AI module private to the application or protect it with a service token.

## 9. Processing Flow

### Uploaded video

1. The user uploads a video through the frontend.
2. Express validates the upload and saves it under `storage/uploads/`.
3. Express creates an `analysis_jobs` document in MongoDB.
4. Express requests video processing from FastAPI.
5. The AI module samples frames, runs YOLO inference, applies PPE rules, and generates annotated output.
6. The AI module returns results and file references/progress.
7. Express saves detection events and updates the job status in MongoDB.
8. The frontend polls the job endpoint and displays progress, summary, timeline, and annotated video.

For a simple MVP, processing can run as a straightforward background task in the AI module. Avoid running long video processing inside a normal request if it causes timeouts; if needed, add a small worker process later.

### Live webcam

1. The browser requests webcam permission.
2. The frontend captures a frame at a controlled interval.
3. The frame is sent to Express, which forwards it to FastAPI.
4. FastAPI returns detected objects and compliance status.
5. The frontend draws the boxes and updates counters.
6. Save selected violation events and snapshots through the backend when appropriate.

## 10. Security and Reliability Basics

- Store secrets in local environment files and never commit them.
- Validate file type, file size, and uploaded content on the server.
- Use generated filenames and prevent path traversal.
- Protect routes and stored footage with authentication and authorization.
- Restrict CORS to the frontend origin.
- Do not expose the FastAPI service directly to the public internet without protection.
- Use sensible request timeouts and show processing failures in the UI.
- Add retention/deletion controls for videos and snapshots.
- Test the selected model on representative footage and measure false positives and false negatives.
- Treat any accuracy percentage shown in a mockup as illustrative until measured on a test dataset.

## 11. Development Plan

### Phase 1 — Project setup
- [ ] Create `frontend/`, `backend/`, and `ai-module/`.
- [ ] Configure environment variables and `.gitignore`.
- [ ] Connect Express to MongoDB with Mongoose.
- [ ] Add health-check endpoints for backend and AI module.
- [ ] Build the shared frontend layout and navigation.

### Phase 2 — Authentication and data
- [ ] Implement login/logout and protected routes.
- [ ] Create Mongoose models for users, jobs, detections, and settings.
- [ ] Add initial admin account setup without hard-coded production credentials.

### Phase 3 — AI detection
- [ ] Select a PPE-trained YOLO model.
- [ ] Implement frame inference with FastAPI and OpenCV.
- [ ] Define compliant, violation, and uncertain rules.
- [ ] Test model outputs and confidence thresholds.

### Phase 4 — Video analysis
- [ ] Implement upload validation and local storage.
- [ ] Create analysis jobs and progress polling.
- [ ] Generate annotated videos and snapshots.
- [ ] Display summaries and a detection timeline.

### Phase 5 — Live detection
- [ ] Implement browser webcam capture and start/stop controls.
- [ ] Connect frame submission to the AI module.
- [ ] Display real-time boxes, labels, and counters.
- [ ] Handle camera permissions and service errors.

### Phase 6 — History, dashboard, and reports
- [ ] Build analytics using stored MongoDB records.
- [ ] Add violation filters and event details.
- [ ] Add CSV export.
- [ ] Add settings and basic retention/deletion behavior.

### Phase 7 — Final testing and demo
- [ ] Test uploaded videos and webcam detection end-to-end.
- [ ] Test failed jobs, invalid files, and low-confidence detections.
- [ ] Verify that dashboard counts match stored events.
- [ ] Document setup and prepare demo videos.
- [ ] Clearly identify any sample/demo data.

## 12. MVP Acceptance Criteria

The MVP is ready for demonstration when:

- A user can log in and access protected pages.
- A supported video can be uploaded and analyzed.
- Processing progress and failure states are visible.
- The completed analysis shows an annotated video and detection results.
- Live webcam detection shows bounding boxes and compliance labels.
- Green, red, and yellow states follow documented rules.
- Detection events and snapshots can be searched and reviewed.
- Dashboard metrics are calculated from stored records.
- Users can filter and export detection history to CSV.
- Settings are saved in MongoDB and applied by the application.
- The application can be started from the documented instructions on a clean development setup.

## 13. Environment Variables

Use `.env.example` to document required settings. Actual `.env` files must be ignored by Git.

### Frontend — `frontend/.env.local`

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### Backend — `backend/.env`

```dotenv
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/vigilantgear
SESSION_SECRET=replace_with_a_long_random_secret
AI_MODULE_URL=http://127.0.0.1:8000
AI_SERVICE_TOKEN=replace_with_a_local_service_secret
STORAGE_DIR=../storage
VIDEO_MAX_UPLOAD_MB=500
```

### AI module — `ai-module/.env`

```dotenv
HOST=127.0.0.1
PORT=8000
PPE_MODEL_PATH=./models/ppe_model.pt
PPE_CONFIDENCE_THRESHOLD=0.50
VIDEO_FRAME_INTERVAL=5
STORAGE_DIR=../storage
AI_SERVICE_TOKEN=replace_with_the_same_local_service_secret
```

Adjust storage paths to the working directory and operating system. Use `0.0.0.0` only when a service must be reachable from another container or machine. Never use the example secrets as real credentials.

## 14. Development Prerequisites

- Node.js LTS and npm.
- Python version compatible with the selected PyTorch/YOLO dependencies.
- MongoDB Community Server locally or a MongoDB Atlas database.
- FFmpeg available to the AI module for reliable video decoding/encoding.
- A PPE-trained YOLO model and permission to use its weights/dataset.
- Optional: Docker Desktop if you prefer containerized local development.

## 15. Out of Scope for the College MVP

- Amazon S3 or other cloud object storage.
- Redis, BullMQ, Kubernetes, and distributed processing.
- Multi-camera CCTV/RTSP fleet management.
- Face recognition or identifying workers by face.
- Automated disciplinary decisions.
- Guaranteed detection of every PPE class in every environment.
- Enterprise billing, complex multi-tenancy, and advanced audit infrastructure.
- Claims of certified safety compliance without suitable validation.

---

## Summary

Build **VigilantGear** with three separately manageable components:

- **Frontend:** Next.js, React, JavaScript, and Tailwind CSS.
- **Backend:** Node.js, Express.js, MongoDB, and Mongoose.
- **AI module:** Python, FastAPI, YOLO, OpenCV, and FFmpeg.

Use MongoDB for application metadata and local filesystem storage for uploaded videos, annotated outputs, and snapshots. Keep the initial implementation focused: REST APIs, simple job-status polling, one AI processing service, and no S3/Redis requirement. Add infrastructure only if the working MVP demonstrates a real need for it.
