import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

export type QuestionOption = {
  option_text: string;
  option_order: number;
  is_correct: boolean;
};

export type Question = {
  question_text: string;
  question_order: number;
  options: QuestionOption[];
};

type QuestionBuilderProps = {
  questions: Question[];
  onChange: (questions: Question[]) => void;
};

export const QuestionBuilder = ({ questions, onChange }: QuestionBuilderProps) => {
  const addQuestion = () => {
    const newQuestion: Question = {
      question_text: '',
      question_order: questions.length + 1,
      options: [
        { option_text: '', option_order: 1, is_correct: false },
        { option_text: '', option_order: 2, is_correct: false },
      ],
    };
    onChange([...questions, newQuestion]);
  };

  const removeQuestion = (questionIndex: number) => {
    const updatedQuestions = questions.filter((_, index) => index !== questionIndex);
    // Reorder questions
    const reorderedQuestions = updatedQuestions.map((q, index) => ({
      ...q,
      question_order: index + 1,
    }));
    onChange(reorderedQuestions);
  };

  const updateQuestion = (questionIndex: number, field: keyof Question, value: string | QuestionOption[]) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value,
    };
    onChange(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    const newOption: QuestionOption = {
      option_text: '',
      option_order: question.options.length + 1,
      is_correct: false,
    };
    question.options.push(newOption);
    onChange(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    question.options = question.options.filter((_, index) => index !== optionIndex);
    // Reorder options
    question.options = question.options.map((option, index) => ({
      ...option,
      option_order: index + 1,
    }));
    onChange(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, field: keyof QuestionOption, value: string | number | boolean) => {
    const updatedQuestions = [...questions];
    const option = updatedQuestions[questionIndex].options[optionIndex];
    
    // If setting this option as correct, unset all others
    if (field === 'is_correct' && value === true) {
      updatedQuestions[questionIndex].options.forEach((opt, idx) => {
        opt.is_correct = idx === optionIndex;
      });
    } else {
      if (field === 'option_text' && typeof value === 'string') {
        option.option_text = value;
      } else if (field === 'option_order' && typeof value === 'number') {
        option.option_order = value;
      } else if (field === 'is_correct' && typeof value === 'boolean') {
        option.is_correct = value;
      }
    }
    
    onChange(updatedQuestions);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Questões</h3>
        <Button type="button" onClick={addQuestion} variant="outline" className="cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Questão
        </Button>
      </div>

      {questions.map((question, questionIndex) => (
        <Card key={questionIndex} className="border-2">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Questão {question.question_order}</CardTitle>
              <Button
                type="button"
                onClick={() => removeQuestion(questionIndex)}
                variant="destructive"
                size="sm"
                className="cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`question-${questionIndex}`}>Texto da Questão</Label>
              <Input
                id={`question-${questionIndex}`}
                value={question.question_text}
                onChange={(e) => updateQuestion(questionIndex, 'question_text', e.target.value)}
                placeholder="Digite sua questão..."
                className="mt-1"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Opções de Resposta</Label>
                <Button
                  type="button"
                  onClick={() => addOption(questionIndex)}
                  variant="outline"
                  size="sm"
                  disabled={question.options.length >= 6}
                  className="cursor-pointer"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Adicionar opção
                </Button>
              </div>

              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`correct-${questionIndex}`}
                    checked={option.is_correct}
                    onChange={() => updateOption(questionIndex, optionIndex, 'is_correct', true)}
                    className="w-4 h-4"
                  />
                  <Input
                    value={option.option_text}
                    onChange={(e) => updateOption(questionIndex, optionIndex, 'option_text', e.target.value)}
                    placeholder={`Opção ${option.option_order}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => removeOption(questionIndex, optionIndex)}
                    variant="destructive"
                    size="sm"
                    disabled={question.options.length <= 2}
                    className="cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              
              <p className="text-sm text-gray-500">
                Selecione o botão de opção ao lado da resposta correta
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      {questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma questão adicionada ainda. Clique em "Adicionar Questão" para começar.</p>
        </div>
      )}
    </div>
  );
};
