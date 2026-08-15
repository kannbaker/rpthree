# Server Architecture

```mermaid
flowchart TD
    EnvFile[".env"] --> EnvService["EnvService"]
    App["App"] --> HttpService["HttpService"]
    EnvService --> HttpService
    EnvService --> StaticService["StaticService"]
    HttpService --> StaticService
    HttpService --> HttpOutput["http"]
    StaticService --> StaticDir["/static/*"]
```
