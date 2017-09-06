% Analysis of all of Rasmus' hours spent from fall 2015 till spring 2017.
% The data should be in a file called 
% For anyone interested in comparing my hours spent with my grades,
% my grades for the courses are as follows:
%
% Quantum: 10
% Probability and statistics: 10
% Fundamental Structure of mathematics: 4
% Physical Technique: 12
% Complex Analysis: 12
% Problem Solving in Physics: 4
% Project: 7
% Thesis: 12

clear all
close all
load('TimesheetRawData.mat')

%% For nice graphs
   set(0, 'defaultLegendInterpreter','latex');%Legend i latex font
   set(0,'defaultTextInterpreter','latex') %Axer i latex font
   set(0,'defaultaxesfontsize',15); 
   set(0,'defaulttextfontsize',15);
   set(0,'defaulttextinterpreter','latex')
   set(0,'defaultlinelinewidth',2) 
   set(0,'defaultaxeslinewidth',1) 
   set(0,'defaultpatchlinewidth',2)
   set(0,'DefaultLineMarkerSize',20)

%% Structering of data

Q = struct ('Date' ,[],'Dur',[],'ECTS',10); % Quantum
S = struct ('Date' ,[],'Dur',[],'ECTS',5); % Stat
Fu = struct ('Date' ,[],'Dur',[],'ECTS',10); % Fundamental
Proj = struct ('Date' ,[],'Dur',[],'ECTS',15); % Projekt
Prob = struct ('Date' ,[],'Dur',[],'ECTS',10); % Problem solving
Fy = struct ('Date' ,[],'Dur',[],'ECTS',5); % Fysisk Teknik
C = struct ('Date' ,[],'Dur',[],'ECTS',5); % Complex
T = struct ('Date' ,[],'Dur',[],'ECTS',30); %Thesis



% plot(Date,relDuration,'*')

%relDuration is in days, so scale to hours.
relDuration = relDuration*24;

for i= 1:size(Project,1)
    if (strcmp(Project(i),'Kvantemekanik '))
        Q.Date = [Q.Date;Date(i)];
        Q.Dur = [Q.Dur;relDuration(i)];
    end
    if (strcmp(Project(i),'Statistik Og Sandsynlighedsregning '))
        S.Date = [S.Date;Date(i)];
        S.Dur = [S.Dur;relDuration(i)];
    end
    if (strcmp(Project(i),'Projekt'))
        Proj.Date = [Proj.Date;Date(i)];
        Proj.Dur = [Proj.Dur;relDuration(i)];
    end
    if (strcmp(Project(i),'Fysisk Teknik '))
        Fy.Date = [Fy.Date;Date(i)];
        Fy.Dur = [Fy.Dur;relDuration(i)];
    end
    if (strcmp(Project(i),'Fysisk Problemløsning'))
        Prob.Date = [Prob.Date;Date(i)];
        Prob.Dur = [Prob.Dur;relDuration(i)];
    end
    if (strcmp(Project(i),'Kompleks Analyse'))
        C.Date = [C.Date;Date(i)];
        C.Dur = [C.Dur;relDuration(i)];
    end
    if (strcmp(Project(i),'Fundamentale Strukturer '))
        Fu.Date = [Fu.Date;Date(i)];
        Fu.Dur = [Fu.Dur;relDuration(i)];
    end
    if (strcmp(Project(i),'Speciale'))
        T.Date = [T.Date;Date(i)];
        T.Dur = [T.Dur;relDuration(i)];
    end
end

Q.sum = sum(Q.Dur);
S.sum = sum(S.Dur);
Proj.sum = sum(Proj.Dur);
Fy.sum = sum(Fy.Dur);
Prob.sum = sum(Prob.Dur);
C.sum = sum(C.Dur);
Fu.sum = sum(Fu.Dur);
T.sum = sum(T.Dur);

Q.sumE = Q.sum/Q.ECTS;
S.sumE = S.sum/S.ECTS;
C.sumE = C.sum/C.ECTS;
T.sumE = T.sum/T.ECTS;
Fu.sumE = Fu.sum/Fu.ECTS;
Fy.sumE = Fy.sum/Fy.ECTS;
Prob.sumE = Prob.sum/Prob.ECTS;
Proj.sumE = Proj.sum/Proj.ECTS;

sumsum = Q.sum+S.sum+Proj.sum+Fy.sum+Prob.sum+C.sum+Fu.sum+T.sum;


%%
figure
hold on
plot(Q.Date,cumsum(Q.Dur))
plot(Fu.Date,cumsum(Fu.Dur))
plot(Fy.Date,cumsum(Fy.Dur))
plot(S.Date,cumsum(S.Dur))
plot(Prob.Date,cumsum(Prob.Dur))
plot(C.Date,cumsum(C.Dur))
plot(Proj.Date,cumsum(Proj.Dur))
plot(T.Date,cumsum(T.Dur),'k')
legend('Quantum Mechanics','Fundamental Structures','Physical Technique','Probability and Statistics','Problem Solving in Physics II','Complex Analysis','Project','Thesis','Location','NorthWest');
ylabel('Cummultative hours spent')
title('1.5 year of study, in hours')

%%
% Time per ECTS
figure
hold on
plot(Q.Date,cumsum(Q.Dur)./Q.ECTS)
plot(Fu.Date,cumsum(Fu.Dur)./Fu.ECTS)
plot(Fy.Date,cumsum(Fy.Dur)./Fy.ECTS)
plot(S.Date,cumsum(S.Dur)./S.ECTS)
plot(Prob.Date,cumsum(Prob.Dur)./Prob.ECTS)
plot(C.Date,cumsum(C.Dur)./C.ECTS)
plot(Proj.Date,cumsum(Proj.Dur)./Proj.ECTS)
plot(T.Date,cumsum(T.Dur)./T.ECTS,'k')
legend('Quantum Mechanics','Fundamental Structures','Physical Technique','Probability and Statistics','Problem Solving in Physics II','Complex Analysis','Project','Thesis','Location','NorthWest');
ylabel('Cummultative hours spent')
title('Hours spent per ECTS point')

%%
% Same start
FallStart = Proj.Date(1)-Q.Date(1);
ThesisStart = T.Date(15)-Q.Date(1);
figure
hold on
plot(Q.Date,cumsum(Q.Dur))
plot(Fu.Date,cumsum(Fu.Dur))
plot(Fy.Date,cumsum(Fy.Dur))
plot(S.Date,cumsum(S.Dur))
plot(Prob.Date-FallStart,cumsum(Prob.Dur))
plot(C.Date-FallStart,cumsum(C.Dur))
plot(Proj.Date-FallStart,cumsum(Proj.Dur))
plot(T.Date-ThesisStart,cumsum(T.Dur),'k')
legend('Quantum Mechanics','Fundamental Structures','Physical Technique','Probability and Statistics','Problem Solving in Physics II','Complex Analysis','Project','Thesis','Location','NorthWest');
ylabel('Cummultative hours spent')
xlim([Q.Date(1),Q.Date(end)]); 
title('Hours spent')

%%
% Pie charts
figure
% hold on
%subplot(1,2,1)
pie([Q.sum,Fu.sum,Fy.sum,S.sum,Prob.sum,C.sum,Proj.sum,T.sum])%,{'Quantum Mechanics','Fundamental Structures','Physical Technique','Probability and Statistics','Problem Solving in Physics II','Complex Analysis','Project','Thesis'})
legend('Quantum Mechanics','Fundamental Structures','Physical Technique','Probability and Statistics','Problem Solving in Physics II','Complex Analysis','Project','Thesis','Location','NorthWest');
title('All work combined')

%%
figure
%subplot(1,2,2)
%bar([Q.sumE,Fu.sumE,Fy.sumE,S.sumE,Prob.sumE,C.sumE,Proj.sumE,T.sumE]')%,{'Quantum Mechanics','Fundamental Structures','Physical Technique','Probability and Statistics','Problem Solving in Physics II','Complex Analysis','Project','Thesis'})
hold on
bar(1,Q.sumE);
bar(2,Fu.sumE,'c');
bar(3,Fy.sumE,'g');
bar(4,S.sumE,'r');
bar(5,Prob.sumE,'m');
bar(6,C.sumE,'y');
bar(7,Proj.sumE,'FaceColor',[1 0.4 0.6]);
bar(8,T.sumE,'k');
plot([xlim],[25 25],'r');
plot([xlim],[30 30],'r');
title('All work per ECTS')
legend('Quantum Mechanics','Fundamental Structures','Physical Technique','Probability and Statistics','Problem Solving in Physics II','Complex Analysis','Project','Thesis','Location','NorthWest');
ylim([0 20]);


%%
figure
pie([Q.sumE,Fu.sumE,Fy.sumE,S.sumE,Prob.sumE,C.sumE],{num2str(Q.sumE),num2str(Fu.sumE),num2str(Fy.sumE),num2str(S.sumE),num2str(Prob.sumE),num2str(C.sumE)})
title('Hours per ECTS, just the courses')
legend('Quantum Mechanics','Fundamental Structures','Physical Technique','Probability and Statistics','Problem Solving in Physics II','Complex Analysis','Location','NorthWest');
