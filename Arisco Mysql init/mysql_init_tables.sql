create table questions(
	id int auto_increment primary key,
    questOrder int,
    description varchar(160),
    active bit,
    category varchar(20),
    separetedFrom int,
    subQuestion bit,
    sectionId int
    );

create table evaluations (
    pacientId bigint, 
    evaluationDate  datetime ,
    suicideRiskResult varchar(20),
    autoagressRiskResult varchar(20),
    heteroagressRiskResult varchar(20),
    escapeRiskResult varchar(20),
    patologyRiskResult varchar(20),
    medicEvalSuicide varchar(20),
    medicEvalAutoagress varchar(20),
    medicEvalHeteroagress varchar(20),
    medicEvalEscape varchar(20),
    medicEvalPatology varchar(20),
    primary key (pacientId, evaluationDate)
    );

create table responses (
	pacientId bigint,
    evaluationDate datetime,
    questionId int,
    response bit,
    primary key (pacientId, evaluationDate, questionId),
    Foreign key (pacientId, evaluationDate) references evaluations(pacientId, evaluationDate),
    Foreign key (questionId) references questions(id)
    );