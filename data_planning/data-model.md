## Detaillierte Datenbeschreibung/Modellierung

### User (Benutzer)
- **id**: UUID
- **email**: E-Mail-Adresse 
- **password**: Verschlüsseltes Passwort
- **name**: Anzeigename
- **role**: Rolle ("teacher" | "student")
- **createdAt**: Erstellungszeitpunkt

### Classroom (Klassenraum)
- **id**:  UUID
- **name**: Name des Klassenraums
- **description**: Beschreibung
- **teacherId**: Referenz zum Lehrer (User.id)
- **createdAt**: Erstellungszeitpunkt

### Test (Schreibtest)
- **id**: UUID
- **title**: Titel des Tests
- **content**: Testinhalt (zu schreibender Text)
- **timeLimit**: Zeitlimit in Sekunden (optional)
- **classroomId**: Referenz zum Klassenraum
- **createdBy**: Referenz zum erstellenden Lehrer
- **createdAt**: Erstellungszeitpunkt

### TestResult (Testergebnis)
- **id**: UUID
- **testId**: Referenz zum Test
- **userId**: Referenz zum Benutzer
- **wpm**: Wörter pro Minute
- **accuracy**: Genauigkeit in Prozent
- **mistakes**: Anzahl der Fehler
- **timeSpent**: Benötigte Zeit in Sekunden
- **createdAt**: Erstellungszeitpunkt

## Beziehungen

1. **User - Classroom**
   - Ein Lehrer kann mehrere Klassenräume erstellen
   - Ein Klassenraum hat genau einen Lehrer

2. **User - Classroom**
   - Ein Schüler kann in mehreren Klassenräumen sein
   - Ein Klassenraum kann mehrere Schüler haben

3. **User - TestResult**
   - Ein Benutzer kann mehrere Testergebnisse haben
   - Ein Testergebnis gehört zu genau einem Benutzer

4. **Classroom - Test**
   - Ein Klassenraum kann mehrere Tests haben
   - Ein Test gehört zu genau einem Klassenraum

5. **Test - TestResult**
   - Ein Test kann mehrere Testergebnisse haben
   - Ein Testergebnis gehört zu genau einem Test

## Indexierung

### Primärschüssel
- User.id
- Classroom.id
- Test.id
- TestResult.id

### Andere
- User.email (unique)
- Classroom.teacherId
- Test.classroomId
- TestResult.userId
- TestResult.testId

## Regeln

1. **Unique Constraints**
   - User.email muss eindeutig sein
   - Classroom.name muss pro Lehrer eindeutig sein

2. **Referentielle Integrität**
   - Classroom.teacherId → User.id
   - Test.classroomId → Classroom.id
   - Test.createdBy → User.id
   - TestResult.testId → Test.id
   - TestResult.userId → User.id

3. **Check Constraints**
   - TestResult.accuracy: 0-100%
   - TestResult.wpm: > 0
   - TestResult.mistakes: ≥ 0
   - Test.timeLimit: > 0 (wenn gesetzt) 