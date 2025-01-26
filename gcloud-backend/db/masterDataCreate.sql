use renderizaidb;

INSERT INTO tipoCliente
VALUES
    (1, "pt", "Arquiteto(a)"),
    (1, "en", "Architect"),
    (1, "es", "Arquitecto(a)"),
    (2, "pt", "Designer de Interiores"),
    (2, "en", "Interior Designer"),
    (2, "es", "Decorador(a) de interiores"),
    (3, "pt", "Marceneiro(a)"),
    (3, "en", "Carpenter"),
    (3, "es", "Carpintero(a)");

INSERT INTO pacoteRender
VALUES
    (1, "pt", "Basico"),
    (1, "en", "Basic"),
    (1, "es", "Básico"),
    (2, "pt", "Padrão"),
    (2, "en", "Standard"),
    (2, "es", "Estándar"),
    (3, "pt", "Premium"),
    (3, "en", "Premium"),
    (3, "es", "Premium");

INSERT INTO capacidadeRenderizador
VALUES
    (1, "pt", "Semanal"),
    (1, "en", "Weekly"),
    (1, "es", "Semanalmente"),
    (2, "pt", "Quinzenal"),
    (2, "en", "Biweekly"),
    (2, "es", "Quincenal"),
    (3, "pt", "Mensal"),
    (3, "en", "Monthly"),
    (3, "es", "Mensual");

INSERT INTO tipoPrioridade
VALUES
    (1, "pt", "Baixa", 15),
    (1, "en", "Low", 15),
    (1, "es", "Bajo", 15),
    (2, "pt", "Média", 7),
    (2, "en", "Medium", 7),
    (2, "es", "Media", 7),
    (3, "pt", "Alta", 7),
    (3, "en", "High", 7),
    (3, "es", "Alta", 7);

INSERT INTO tipoStatus
VALUES
    (1, "pt", "Solicitada"),
    (2, "pt", "Em Análise"),
    (3, "pt", "Aguardando Informação Adicional"),
    (4, "pt", "Em Andamento"),
    (5, "pt", "Aprovação Solicitada"),
    (6, "pt", "Revisão Solicitada"),
    (7, "pt", "Aguardando Pagamento"),
    (8, "pt", "Finalizado"),
    (1, "en", "Requested"),
    (2, "en", "Under Analysis"),
    (3, "en", "Waiting for Additional Information"),
    (4, "en", "In Progress"),
    (5, "en", "Approval Requested"),
    (6, "en", "Review Requested"),
    (7, "en", "Waiting Payment"),
    (8, "en", "Completed"),
    (1, "es", "Solicitada"),
    (2, "es", "En Análisis"),
    (3, "es", "En Espera de Información Adicional"),
    (4, "es", "En Progreso"),
    (5, "es", "Aprobación Solicitada"),
    (6, "es", "Revisión Solicitada"),
    (7, "es", "Esperando Pago"),
    (8, "es", "Terminado");

INSERT INTO tipoRole
VALUES
    (1, "pt", "Visualizador"),
    (1, "en", "Viewer"),
    (1, "es", "Espectador"),
    (2, "pt", "Editor"),
    (2, "en", "Editor"),
    (2, "es", "Editor"),
    (3, "pt", "Proprietário(a)"),
    (3, "en", "Owner"),
    (3, "es", "Dueño(a)");