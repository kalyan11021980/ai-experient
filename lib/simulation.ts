import { useSimulationStore } from './store';
import { generateAIResponse, createConversationHistory } from './ai';
import { INTERVIEW_QUESTIONS, BUDGET_CONSTRAINTS } from './constants';

export class SimulationEngine {
  async startSimulation() {
    console.log('SimulationEngine: Starting simulation...');
    
    try {
      // Get fresh store state
      const { setStage, characters, addMessage } = useSimulationStore.getState();
      
      // Start with technical interview round 1
      setStage('technical1');
      console.log('SimulationEngine: Set stage to technical1');
      
      // Generate AI welcome message from interviewer1
      const welcomePrompt = `You are starting the first technical interview round. Introduce yourself professionally and explain that you'll be conducting the technical interview. Keep it very brief (1-2 sentences) and welcoming.`;
      
      const welcomeResponse = await generateAIResponse(
        characters.interviewer1,
        [{ role: 'user', content: welcomePrompt }],
        undefined
      );

      addMessage({
        character: 'interviewer1',
        content: welcomeResponse
      });
      console.log('SimulationEngine: Added AI-generated welcome message');

      // Start asking questions after a short delay
      setTimeout(() => {
        console.log('SimulationEngine: Starting questions...');
        this.askNextQuestion();
      }, 2000);
      
    } catch (error) {
      console.error('SimulationEngine: Critical error in startSimulation:', error);
      throw error;
    }
  }

  async askNextQuestion() {
    console.log('SimulationEngine: askNextQuestion called');
    
    try {
      // Get fresh store state
      const { 
        currentStage, 
        currentQuestionIndex, 
        characters, 
        messages, 
        addMessage
      } = useSimulationStore.getState();

      console.log('SimulationEngine: Current state', { currentStage, currentQuestionIndex });

      const questionOffset = currentStage === 'technical1' ? 0 : 4;
      const questionIndex = currentQuestionIndex + questionOffset;

      if (questionIndex >= 8) { // Only use first 8 questions (4 per round)
        console.log('SimulationEngine: All questions completed, moving to next stage');
        await this.moveToNextStage();
        return;
      }

      if (questionIndex >= 4 && currentStage === 'technical1') {
        console.log('SimulationEngine: Technical1 round completed, moving to next stage');
        await this.moveToNextStage();
        return;
      }

      const question = INTERVIEW_QUESTIONS[questionIndex];
      const interviewer = currentStage === 'technical1' ? characters.interviewer1 : characters.interviewer2;

      console.log('SimulationEngine: Asking question', { questionIndex, question: question.question });

      try {
        const conversationHistory = createConversationHistory(
          messages.map(m => ({ character: m.character, content: m.content }))
        );

        const questionPrompt = `Please ask this interview question: "${question.question}"

Keep it conversational and professional. Be very brief (1-2 sentences max) and focus on asking the question clearly.`;

        const response = await generateAIResponse(
          interviewer, 
          [...conversationHistory, { role: 'user', content: questionPrompt }],
          undefined
        );

        addMessage({
          character: interviewer.role,
          content: response
        });

        console.log('SimulationEngine: AI Question asked, waiting for job seeker response');

        // Wait for job seeker's response
        setTimeout(() => this.generateJobSeekerResponse(question.question), 3000);

      } catch (error) {
        console.error('SimulationEngine: Error with AI question generation:', error);
        
        // Add error message and stop simulation
        addMessage({
          character: interviewer.role,
          content: `I apologize, but I'm experiencing technical difficulties connecting to the AI service. Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
        
        return; // Stop the simulation
      }
    } catch (error) {
      console.error('SimulationEngine: Critical error in askNextQuestion:', error);
      
      // Add error message to conversation
      const { addMessage } = useSimulationStore.getState();
      addMessage({
        character: 'interviewer1',
        content: `I apologize, but we're experiencing some technical difficulties. Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  async generateJobSeekerResponse(question: string) {
    console.log('SimulationEngine: Generating job seeker response for:', question);
    
    try {
      // Get fresh store state
      const { characters, messages, addMessage } = useSimulationStore.getState();

      const conversationHistory = createConversationHistory(
        messages.map(m => ({ character: m.character, content: m.content }))
      );

      const questionPrompt = `Please answer this interview question professionally and concisely (2-3 sentences max): ${question}`;

      const response = await generateAIResponse(
        characters.jobSeeker, 
        [...conversationHistory, { role: 'user', content: questionPrompt }],
        undefined
      );

      console.log('SimulationEngine: Job seeker response received:', response);

      addMessage({
        character: 'jobSeeker',
        content: response
      });

      console.log('SimulationEngine: Job seeker AI response added successfully');

      // Evaluate the answer
      setTimeout(() => this.evaluateAnswer(question, response), 2000);

    } catch (error) {
      console.error('SimulationEngine: Error generating job seeker response:', error);
      
      // Add error message and stop simulation
      const { addMessage } = useSimulationStore.getState();
      addMessage({
        character: 'jobSeeker',
        content: `I'm experiencing technical difficulties connecting to the AI service. Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      
      return; // Stop the simulation
    }
  }

  async evaluateAnswer(question: string, answer: string) {
    const { 
      currentStage, 
      currentQuestionIndex, 
      characters, 
      addEvaluation, 
      nextQuestion 
    } = useSimulationStore.getState();

    const interviewer = currentStage === 'technical1' ? characters.interviewer1 : characters.interviewer2;
    const questionId = currentQuestionIndex + (currentStage === 'technical1' ? 1 : 5);

    try {
      // Make evaluation more human with interviewer's personality
      const interviewerContext = currentStage === 'technical1' ? 
        `As ${interviewer.name} (perfectionist frontend lead who values clean code and modern practices)` :
        `As ${interviewer.name} (arrogant backend engineer who thinks he knows everything and believes most candidates lack "real" experience)`;
      
      const evaluationPrompt = `${interviewerContext}, evaluate this interview answer based on your personality and biases:

Question: ${question}
Answer: ${answer}

Consider your personal preferences:
${currentStage === 'technical1' ? `
- Do they mention testing, accessibility, or performance? (You love this)
- Are they using modern JavaScript patterns? (You prefer this)
- Do they ask follow-up questions or show curiosity? (You score higher for this)
- Do they seem to understand the "why" behind decisions? (Important to you)
` : `
- Do they mention trendy frameworks without understanding fundamentals? (You hate this - score much lower)
- Are they giving theoretical answers vs real startup/scaling experience? (You're very skeptical of theory)
- Do they actually understand how things work "in the real world" vs just parroting tutorials? (Most don't, in your opinion)
- Are they overcomplicating simple problems with modern nonsense? (You strongly disapprove)
- Do they seem like they've actually built systems that handle real traffic? (You doubt most candidates have)
- Remember: You believe frontend work is just "pretty UI stuff" and real engineering happens in backend systems
`}

Be human in your evaluation - let your biases show subtly. 

You MUST respond in EXACTLY this format:
SCORE: [number from 1-10]
FEEDBACK: [your detailed feedback as the interviewer, including your personal reactions and biases]

Do not include any other text, actions, or formatting. Just SCORE and FEEDBACK.`;

      const evaluation = await generateAIResponse(interviewer, [
        { role: 'user', content: evaluationPrompt }
      ], undefined);

      // Parse the evaluation with improved regex
      const scoreMatch = evaluation.match(/SCORE:\s*(\d+)|Score:\s*(\d+)/i);
      const feedbackMatch = evaluation.match(/FEEDBACK:\s*(.+)|Feedback:\s*(.+)/is);

      const score = scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 5;
      const feedback = feedbackMatch ? (feedbackMatch[1] || feedbackMatch[2]).trim() : evaluation.trim();

      console.log('Evaluation parsing:', { 
        rawEvaluation: evaluation, 
        scoreMatch: scoreMatch?.[0], 
        feedbackMatch: feedbackMatch?.[0],
        finalScore: score,
        finalFeedback: feedback 
      });

      addEvaluation({
        questionId,
        score,
        feedback,
        character: interviewer.role
      });

      nextQuestion();

      // Continue with next question or move to next stage
      setTimeout(() => this.askNextQuestion(), 1500);

    } catch (error) {
      console.error('Error evaluating answer:', error);
      nextQuestion();
      setTimeout(() => this.askNextQuestion(), 1500);
    }
  }

  async moveToNextStage() {
    const { currentStage, setStage } = useSimulationStore.getState();

    switch (currentStage) {
      case 'technical1':
        setStage('technical2');
        setTimeout(() => this.startTechnicalRound2(), 1000);
        break;
      case 'technical2':
        setStage('hrDiscussion');
        setTimeout(() => this.startHRDiscussion(), 1000);
        break;
      case 'hrDiscussion':
        setStage('directorApproval');
        setTimeout(() => this.startDirectorApproval(), 1000);
        break;
      case 'directorApproval':
        setStage('completed');
        break;
      default:
        break;
    }
  }

  async startTechnicalRound2() {
    const { addMessage, characters } = useSimulationStore.getState();
    
    // Generate AI introduction for interviewer2
    const introPrompt = `You are starting the second technical interview round. Introduce yourself with slight condescension and explain that you'll be focusing on backend systems and architecture - the "real" engineering work. Keep it very brief (1-2 sentences) and show subtle superiority about backend vs frontend.`;
    
    const introResponse = await generateAIResponse(
      characters.interviewer2,
      [{ role: 'user', content: introPrompt }],
      undefined
    );
    
    addMessage({
      character: 'interviewer2',
      content: introResponse
    });

    // Reset question index for round 2
    useSimulationStore.setState({ currentQuestionIndex: 0 });
    setTimeout(() => this.askNextQuestion(), 2000);
  }

  async startHRDiscussion() {
    const { evaluations, addMessage, characters } = useSimulationStore.getState();

    // Calculate average score and analyze interviewer differences
    const averageScore = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length;
    const interviewer1Scores = evaluations.filter(e => e.character === 'interviewer1').map(e => e.score);
    const interviewer2Scores = evaluations.filter(e => e.character === 'interviewer2').map(e => e.score);
    const interviewer1Avg = interviewer1Scores.reduce((a, b) => a + b, 0) / interviewer1Scores.length;
    const interviewer2Avg = interviewer2Scores.reduce((a, b) => a + b, 0) / interviewer2Scores.length;
    const scoreDifference = Math.abs(interviewer1Avg - interviewer2Avg);

    // Generate AI HR introduction with awareness of interviewer feedback patterns
    const hrIntroPrompt = `You are starting the HR discussion phase. You've reviewed the technical interviews and noticed:
    - Average technical score: ${averageScore.toFixed(1)}/10
    - ${characters.interviewer1.name} (frontend interviewer) average score: ${interviewer1Avg.toFixed(1)}/10
    - ${characters.interviewer2.name} (backend interviewer) average score: ${interviewer2Avg.toFixed(1)}/10
    ${scoreDifference > 1.5 ? '- Notable disagreement between interviewers about candidate strength' : '- Both interviewers generally aligned on candidate assessment'}
    
    Introduce yourself and share your initial assessment, then mention you need to consult with the Director about compensation strategy.`;
    
    const hrIntroResponse = await generateAIResponse(
      characters.hr,
      [{ role: 'user', content: hrIntroPrompt }],
      undefined
    );

    addMessage({
      character: 'hr',
      content: hrIntroResponse
    });

    // HR consults with Director about compensation strategy
    setTimeout(async () => {
      try {
        const hrToDirectorPrompt = `You need to consult with Director ${characters.director.name} about compensation strategy for this candidate:
        
        CANDIDATE ASSESSMENT:
        - Technical average: ${averageScore.toFixed(1)}/10
        - Frontend skills (${characters.interviewer1.name}'s assessment): ${interviewer1Avg.toFixed(1)}/10
        - Backend skills (${characters.interviewer2.name}'s assessment): ${interviewer2Avg.toFixed(1)}/10
        - Interviewer consensus: ${scoreDifference > 1.5 ? 'Mixed - some disagreement' : 'Good alignment'}
        
        Present your initial compensation recommendation and ask for the Director's input. Show your HR perspective on team fit, growth potential, and budget considerations.`;

        const hrToDirectorResponse = await generateAIResponse(
          characters.hr,
          [{ role: 'user', content: hrToDirectorPrompt }],
          undefined
        );

        addMessage({
          character: 'hr',
          content: hrToDirectorResponse
        });

        // Director responds to HR's recommendation
        setTimeout(async () => {
          const directorToHRPrompt = `HR ${characters.hr.name} has consulted you about compensation for this candidate. Review her assessment and provide your director perspective:
          
          TECHNICAL PERFORMANCE:
          - Overall: ${averageScore.toFixed(1)}/10
          - Frontend vs Backend: ${interviewer1Avg.toFixed(1)} vs ${interviewer2Avg.toFixed(1)}
          ${scoreDifference > 1.5 ? '- Concerning disagreement between interviewers' : '- Interviewers generally aligned'}
          
          As Director, share your thoughts on:
          - What compensation range you're comfortable with
          - Any concerns about the technical assessment
          - Strategic considerations for team composition
          - Your gut feeling about this hire
          
          Show potential disagreement with HR if your priorities differ (budget vs talent quality).`;

          const directorToHRResponse = await generateAIResponse(
            characters.director,
            [{ role: 'user', content: directorToHRPrompt }],
            undefined
          );

          addMessage({
            character: 'director',
            content: directorToHRResponse
          });

          // Now HR finalizes compensation based on Director's input
          setTimeout(() => this.finalizeCompensationOffer(), 2000);
        }, 2000);
        
      } catch (error) {
        console.error('Error in HR-Director consultation:', error);
      }
    }, 2000);
  }

  async finalizeCompensationOffer() {
    const { evaluations, addMessage, setCompensationPackage, characters } = useSimulationStore.getState();

    const averageScore = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length;
    const interviewer1Scores = evaluations.filter(e => e.character === 'interviewer1').map(e => e.score);
    const interviewer2Scores = evaluations.filter(e => e.character === 'interviewer2').map(e => e.score);
    const scoreDifference = Math.abs(
      (interviewer1Scores.reduce((a, b) => a + b, 0) / interviewer1Scores.length) - 
      (interviewer2Scores.reduce((a, b) => a + b, 0) / interviewer2Scores.length)
    );

    // Generate compensation package influenced by both HR and Director perspectives
    const compensationMultiplier = Math.min(averageScore / 10, 1);
    const hrAdjustment = scoreDifference > 1.5 ? 0.9 : 1.0; // Conservative if interviewers disagree
    const baseSalary = Math.floor(BUDGET_CONSTRAINTS.MAX_BASE_SALARY * compensationMultiplier * hrAdjustment);
    const bonus = Math.floor(BUDGET_CONSTRAINTS.MAX_BONUS * compensationMultiplier * hrAdjustment);
    const benefits = Math.floor(BUDGET_CONSTRAINTS.MAX_BENEFITS * 0.8);

    const compensationPackage = {
      baseSalary,
      bonus,
      benefits,
      total: baseSalary + bonus + benefits
    };

    setCompensationPackage(compensationPackage);

    try {
      const finalOfferPrompt = `After consulting with Director ${characters.director.name}, finalize and present the compensation package to the candidate:
      - Agreed package: Base $${baseSalary.toLocaleString()}, Bonus $${bonus.toLocaleString()}, Benefits $${benefits.toLocaleString()} (Total: $${compensationPackage.total.toLocaleString()})
      
      Present this professionally, acknowledging the collaborative decision-making process with the Director. Explain how the offer reflects both technical performance and strategic fit.`;

      const finalOfferResponse = await generateAIResponse(
        characters.hr,
        [{ role: 'user', content: finalOfferPrompt }],
        undefined
      );

      addMessage({
        character: 'hr',
        content: finalOfferResponse
      });

      // Generate job seeker response to compensation
      setTimeout(async () => {
        const jobSeekerNegotiationPrompt = `The HR manager has presented a compensation package after consulting with the Director. As ${characters.jobSeeker.name}, someone with slight anxiety about compensation but trying to negotiate professionally, respond to this offer. Consider the package and either accept, negotiate, or ask questions. Show your human side - maybe some nervousness mixed with trying to be professional.`;
        
        const jobSeekerResponse = await generateAIResponse(
          characters.jobSeeker,
          [{ role: 'user', content: jobSeekerNegotiationPrompt }],
          undefined
        );

        addMessage({
          character: 'jobSeeker',
          content: jobSeekerResponse
        });

        // Move to director final approval after job seeker responds
        setTimeout(() => this.moveToNextStage(), 3000);
      }, 2000);
      
    } catch (error) {
      console.error('Error in final compensation offer:', error);
    }
  }

  async startDirectorApproval() {
    const { 
      evaluations, 
      compensationPackage, 
      characters, 
      addMessage, 
      setFinalDecision 
    } = useSimulationStore.getState();

    const averageScore = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length;
    const interviewer1Scores = evaluations.filter(e => e.character === 'interviewer1').map(e => e.score);
    const interviewer2Scores = evaluations.filter(e => e.character === 'interviewer2').map(e => e.score);
    const interviewer1Avg = interviewer1Scores.reduce((a, b) => a + b, 0) / interviewer1Scores.length;
    const interviewer2Avg = interviewer2Scores.reduce((a, b) => a + b, 0) / interviewer2Scores.length;
    const scoreDifference = Math.abs(interviewer1Avg - interviewer2Avg);
    
    // Director's complex decision-making with human factors
    const budgetOK = compensationPackage && compensationPackage.total <= BUDGET_CONSTRAINTS.MAX_TOTAL;
    const technicalThreshold = averageScore >= 6;
    
    try {
      const directorPrompt = `As the Engineering Director, you're making the final hiring decision for candidate ${characters.jobSeeker.name}. Here's what you're weighing:

CANDIDATE: ${characters.jobSeeker.name} (Job Seeker)

TECHNICAL ASSESSMENT:
- Overall average: ${averageScore.toFixed(1)}/10
- ${characters.interviewer1.name} (frontend interviewer) gave: ${interviewer1Avg.toFixed(1)}/10 average
- ${characters.interviewer2.name} (backend interviewer) gave: ${interviewer2Avg.toFixed(1)}/10 average
- Interviewer agreement: ${scoreDifference > 1.5 ? 'Significant disagreement - this concerns you' : 'Generally aligned'}

BUSINESS FACTORS:
- Proposed package: $${compensationPackage?.total.toLocaleString()} (Budget limit: $${BUDGET_CONSTRAINTS.MAX_TOTAL.toLocaleString()})
- Budget status: ${budgetOK ? 'Within budget' : 'OVER BUDGET - this is a problem'}
- Team needs: You need someone who can potentially lead in 2 years

HUMAN FACTORS (your internal thoughts about ${characters.jobSeeker.name}):
- You're slightly worried about whether ${characters.jobSeeker.name} can ${interviewer1Avg > interviewer2Avg ? 'handle backend complexity' : 'understand modern frontend practices'}
- The HR discussion raised ${scoreDifference > 1.5 ? 'red flags about team consensus' : 'positive points about team fit'}
- Your gut feeling about ${characters.jobSeeker.name}: ${averageScore > 7 ? 'Strong technical candidate' : averageScore > 5 ? 'Decent but not exceptional' : 'Below our usual bar'}

Make your decision about hiring ${characters.jobSeeker.name}, but show your internal conflict and reasoning. Consider overruling the data if your experience tells you otherwise. Be human - mention specific concerns, gut feelings, and the business pressures you're facing. Remember: you're evaluating ${characters.jobSeeker.name}, not the interviewers.`;

      const directorResponse = await generateAIResponse(characters.director, [
        { role: 'user', content: directorPrompt }
      ], undefined);

      addMessage({
        character: 'director',
        content: directorResponse
      });

      // Director might make a decision that goes against pure data
      const directorDecision = (technicalThreshold && budgetOK) || 
                              (averageScore > 7.5) || // Strong technical overrides budget concerns  
                              (averageScore > 6 && budgetOK && scoreDifference < 1); // Good technical + budget + alignment
      
      setFinalDecision(directorDecision ? 'approved' : 'rejected');

      // Add internal monologue after decision
      setTimeout(async () => {
        const internalPrompt = `You've just made your decision about ${characters.jobSeeker.name}. As the director, share your internal thoughts about this decision - your doubts, confidence, or concerns about how ${characters.jobSeeker.name} will work out as a hire. This is your private reflection, be honest about the human factors that influenced you.`;
        
        const internalResponse = await generateAIResponse(characters.director, [
          { role: 'user', content: internalPrompt }
        ], undefined);

        addMessage({
          character: 'director',
          content: `*Internal reflection*: ${internalResponse}`
        });

        // After Director's decision, HR makes final announcement
        setTimeout(() => this.hrFinalAnnouncement(), 2000);
      }, 3000);

    } catch (error) {
      console.error('Error in director approval:', error);
      setFinalDecision((technicalThreshold && budgetOK) ? 'approved' : 'rejected');
    }
  }

  async hrFinalAnnouncement() {
    const { 
      finalDecision, 
      characters, 
      addMessage,
      compensationPackage,
      evaluations 
    } = useSimulationStore.getState();

    const averageScore = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length;

    try {
      const hrFinalPrompt = `The Director has made the final decision about ${characters.jobSeeker.name}: ${finalDecision?.toUpperCase()}.

As the HR Manager, you need to formally communicate this decision to the candidate. ${finalDecision === 'approved' ? 
`Congratulations! Present the approved compensation package: 
- Base Salary: $${compensationPackage?.baseSalary.toLocaleString()}
- Bonus: $${compensationPackage?.bonus.toLocaleString()} 
- Benefits: $${compensationPackage?.benefits.toLocaleString()}
- Total: $${compensationPackage?.total.toLocaleString()}

Welcome them to the team and outline next steps.` :
`Unfortunately, we won't be moving forward. Provide professional feedback based on the technical assessment (average score: ${averageScore.toFixed(1)}/10) and encourage them for future opportunities.`
}

Keep it professional, warm, and brief (2-3 sentences).`;

      const hrFinalResponse = await generateAIResponse(
        characters.hr,
        [{ role: 'user', content: hrFinalPrompt }],
        undefined
      );

      addMessage({
        character: 'hr',
        content: hrFinalResponse
      });

      // Job seeker responds to final decision
      setTimeout(() => this.jobSeekerFinalResponse(), 2000);

    } catch (error) {
      console.error('Error in HR final announcement:', error);
      // Move to completed anyway
      setTimeout(() => this.moveToNextStage(), 1000);
    }
  }

  async jobSeekerFinalResponse() {
    const { 
      finalDecision, 
      characters, 
      addMessage 
    } = useSimulationStore.getState();

    try {
      const jobSeekerFinalPrompt = `You've just received the final decision from HR: ${finalDecision?.toUpperCase()}. 

As ${characters.jobSeeker.name}, respond appropriately to this news. ${finalDecision === 'approved' ? 
'Express gratitude, excitement, and ask any final questions about start date or next steps.' :
'Thank them professionally, ask for feedback if appropriate, and maintain a positive attitude for future opportunities.'
}

Keep it brief and authentic to your personality (1-2 sentences).`;

      const jobSeekerFinalResponse = await generateAIResponse(
        characters.jobSeeker,
        [{ role: 'user', content: jobSeekerFinalPrompt }],
        undefined
      );

      addMessage({
        character: 'jobSeeker',
        content: jobSeekerFinalResponse
      });

      // Complete the simulation
      setTimeout(() => this.moveToNextStage(), 2000);

    } catch (error) {
      console.error('Error in job seeker final response:', error);
      // Complete anyway
      setTimeout(() => this.moveToNextStage(), 1000);
    }
  }
}

export const simulationEngine = new SimulationEngine(); 