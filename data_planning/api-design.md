# MoosiType API Design
MOOSI: `npm run dev` startet server

## Authentifizierung
- JWT (JSON Web Token)

## Endpunkte

### Authentifizierung
```
POST /auth/register
- Registriere einen neuen Benutzer (Lehrer oder Schüler)
- Body: {
    email: string,
    password: string,
    name: string,
    role: "teacher" | "student"
}

POST /auth/login
- Benutzer einloggen
- Body: {
    email: string,
    password: string
}
```

### Classroom
```
POST /classrooms
- Erstelle ein neues Klassenzimmer (nur Lehrer)
- Body: {
    name: string,
    description: string
}

GET /classrooms
- Alle Klassenzimmer des eingeloggten Lehrers abrufen
- Query-Parameter:
    - page: number
    - limit: number

GET /classrooms/{classroomId}
- Details eines bestimmten Klassenzimmers abrufen

POST /classrooms/{classroomId}
- Klassenzimmerdetails aktualisieren
- Body: {
    name?: string,
    description?: string
}

DELETE /classrooms/{classroomId}
- Ein Klassenzimmer löschen

POST /classrooms/{classroomId}/students
- Schüler zum Klassenzimmer hinzufügen
- Body: {
    studentEmails: string[]
}

DELETE /classrooms/{classroomId}/students/{studentId}
- Einen Schüler aus dem Klassenzimmer entfernen
```

### Typing Tests
```
POST /tests
- Erstelle einen neuen Schreibtest (nur Lehrer)
- Body: {
    title: string,
    content: string,
    timeLimit?: number,
    classroomId: string
}

GET /tests
- Alle verfügbaren Tests abrufen
- Query-Parameter:
    - classroomId?: string
    - page: number
    - limit: number

GET /tests/{testId}
- Details eines bestimmten Tests abrufen

PUT /tests/{testId}
- Testdetails aktualisieren
- Body: {
    title?: string,
    content?: string,
    timeLimit?: number
}

DELETE /tests/{testId}
- Einen Test löschen
```

### Testergebnisse
```
POST /results
- Testergebnisse einreichen
- Body: {
    testId: string,
    wpm: number,
    accuracy: number,
    mistakes: number,
    timeSpent: number
}

GET /results
- Testergebnisse abrufen
- Query-Parameter:
    - testId?: string
    - studentId?: string
    - classroomId?: string
    - startDate?: string
    - endDate?: string
    - page: number
    - limit: number

GET /results/statistics
- Aggregierte Statistiken abrufen
- Query-Parameter:
    - classroomId?: string
    - studentId?: string
    - timeRange?: "day" | "week" | "month" | "year"
```

### Benutzerprofil
```
GET /profile
- Aktuelles Benutzerprofil abrufen

PUT /profile
- Benutzerprofil aktualisieren
- Body: {
    name?: string,
    email?: string,
    password?: string
}

GET /profile/statistics
- Persönliche Schreibstatistiken abrufen
- Query-Parameter:
    - timeRange?: "day" | "week" | "month" | "year"
```

## Antwortformat
```json
{
    "success": boolean,
    "data": any,
    "error": {
        "code": string,
        "message": string
    }
}
```

## Fehlercodes (für Moosi damit er weiß)
- 400: Schlechte Anfrage
- 401: Nicht autorisiert
- 403: Verboten
- 404: Nicht gefunden
- 422: Validierungsfehler
- 500: Interner Serverfehler

## Ratenbegrenzung
- 100 Anfragen pro Minute pro IP
- 1000 Anfragen pro Stunde pro Benutzer

## Datenmodelle

### Benutzer
```json
{
    "id": string,
    "email": string,
    "name": string,
    "role": "teacher" | "student",
    "createdAt": timestamp
}
```

### Classroom
```json
{
    "id": string,
    "name": string,
    "description": string,
    "teacherId": string,
    "students": User[],
    "createdAt": timestamp
}
```

### Test
```json
{
    "id": string,
    "title": string,
    "content": string,
    "timeLimit": number,
    "classroomId": string,
    "createdBy": string,
    "createdAt": timestamp
}
```

### Testergebnis
```json
{
    "id": string,
    "testId": string,
    "userId": string,
    "wpm": number,
    "accuracy": number,
    "mistakes": number,
    "timeSpent": number,
    "createdAt": timestamp
}