import { useEffect, useContext } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { IAMContext } from '@/modules/IAM/context/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Award,
  BookOpen,
  Calendar,
  Trophy,
  Brain
} from 'lucide-react';

type ActivityReportsData = {
  overview: {
    total_activities: number;
    total_completions: number;
    average_score: number;
    completion_rate: number;
  };
  student_rankings: {
    student_id: string;
    student_name: string;
    total_activities: number;
    average_score: number;
    completion_rate: number;
    total_correct_answers: number;
    total_questions: number;
  }[];
  classroom_rankings: {
    classroom_id: string;
    classroom_name: string;
    total_students: number;
    average_score: number;
    completion_rate: number;
    total_activities: number;
  }[];
  activity_effectiveness: {
    activity_id: string;
    activity_name: string;
    template_name: string;
    total_attempts: number;
    completion_rate: number;
    average_score: number;
    difficulty_rating: 'Easy' | 'Medium' | 'Hard';
  }[];
  question_analysis: {
    question_id: string;
    question_text: string;
    activity_name: string;
    total_attempts: number;
    correct_rate: number;
    difficulty_rating: 'Easy' | 'Medium' | 'Hard';
  }[];
  monthly_trends: {
    month: string;
    total_completions: number;
    average_score: number;
    unique_students: number;
  }[];
};

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const getDifficultyColor = (rating: string) => {
  switch (rating) {
    case 'Easy': return 'bg-green-100 text-green-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'Hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const ActivityReports = () => {
  const { user } = useContext(IAMContext);
  const { data: reportsData, loading, error, fetch: fetchReports } = useFetch<ActivityReportsData>('/analytics/activity-reports');

  useEffect(() => {
    if (user?.id) {
      fetchReports({
        name: 'GET',
        url: `/analytics/activity-reports?teacher_id=${user.id}`
      });
    }
  }, [user?.id, fetchReports]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-700"></div>
      </div>
    );
  }

  if (error || !reportsData) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Erro ao carregar relatórios. Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atividades</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.overview.total_activities}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Conclusões</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.overview.total_completions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontuação Média</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.overview.average_score}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.overview.completion_rate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports Tabs */}
      <Tabs defaultValue="rankings" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="effectiveness">Efetividade</TabsTrigger>
          <TabsTrigger value="questions">Questões</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="classrooms">Turmas</TabsTrigger>
        </TabsList>

        {/* Student and Classroom Rankings */}
        <TabsContent value="rankings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Rankings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Top 10 Alunos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportsData.student_rankings.slice(0, 10).map((student, index) => (
                    <div key={student.student_id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{student.student_name}</p>
                          <p className="text-sm text-gray-600">
                            {student.total_activities} atividades • {student.total_correct_answers}/{student.total_questions} corretas
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{student.average_score}%</p>
                        <Progress value={student.average_score} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Classroom Rankings Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Performance por Turma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportsData.classroom_rankings.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="classroom_name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="average_score" fill="#10b981" name="Pontuação Média %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Effectiveness */}
        <TabsContent value="effectiveness" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Efetividade das Atividades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.activity_effectiveness.map((activity) => (
                  <div key={activity.activity_id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{activity.activity_name}</h4>
                        <p className="text-sm text-gray-600">Modelo: {activity.template_name}</p>
                      </div>
                      <Badge className={getDifficultyColor(activity.difficulty_rating)}>
                        {activity.difficulty_rating === 'Easy' ? 'Fácil' :
                         activity.difficulty_rating === 'Medium' ? 'Médio' : 'Difícil'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Tentativas</p>
                        <p className="font-bold">{activity.total_attempts}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Taxa de Conclusão</p>
                        <p className="font-bold">{activity.completion_rate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Pontuação Média</p>
                        <p className="font-bold">{activity.average_score}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Question Analysis */}
        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Questões Mais Desafiadoras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.question_analysis.map((question) => (
                  <div key={question.question_id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium mb-1">{question.question_text}</p>
                        <p className="text-sm text-gray-600">Atividade: {question.activity_name}</p>
                      </div>
                      <Badge className={getDifficultyColor(question.difficulty_rating)}>
                        {question.difficulty_rating === 'Easy' ? 'Fácil' :
                         question.difficulty_rating === 'Medium' ? 'Médio' : 'Difícil'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span>{question.total_attempts} tentativas</span>
                        <span>{question.correct_rate}% de acertos</span>
                      </div>
                      <Progress value={question.correct_rate} className="w-24 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Trends */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Tendências Mensais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={reportsData.monthly_trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="total_completions" fill="#10b981" name="Conclusões" />
                  <Line yAxisId="right" type="monotone" dataKey="average_score" stroke="#f59e0b" strokeWidth={3} name="Pontuação Média %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classroom Details */}
        <TabsContent value="classrooms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportsData.classroom_rankings.map((classroom) => (
              <Card key={classroom.classroom_id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{classroom.classroom_name}</span>
                    <Badge variant="outline">{classroom.total_students} alunos</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pontuação Média</span>
                      <span className="font-bold">{classroom.average_score}%</span>
                    </div>
                    <Progress value={classroom.average_score} className="h-2" />
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxa de Conclusão</span>
                      <span className="font-bold">{classroom.completion_rate}%</span>
                    </div>
                    <Progress value={classroom.completion_rate} className="h-2" />
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total de Atividades</span>
                      <span className="font-bold">{classroom.total_activities}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
