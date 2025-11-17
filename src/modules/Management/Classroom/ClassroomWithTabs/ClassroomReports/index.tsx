import { useEffect, useContext } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { IAMContext } from '@/modules/IAM/context/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Users, 
  Target, 
  Award,
  BookOpen,
  FileText,
  TrendingUp,
  Clock,
  Trophy
} from 'lucide-react';

type ClassroomReportsData = {
  overview: {
    total_students: number;
    total_activities: number;
    total_materials: number;
    avg_activity_score: number;
    activity_completion_rate: number;
    material_completion_rate: number;
  };
  student_performance: {
    student_id: string;
    student_name: string;
    activities_completed: number;
    materials_completed: number;
    avg_activity_score: number;
    total_activities: number;
    total_materials: number;
    activity_completion_rate: number;
    material_completion_rate: number;
    overall_engagement: number;
  }[];
  activity_performance: {
    activity_id: string;
    activity_name: string;
    total_students: number;
    completed_students: number;
    completion_rate: number;
    average_score: number;
    difficulty_rating: 'Easy' | 'Medium' | 'Hard';
  }[];
  material_engagement: {
    material_id: string;
    material_name: string;
    material_type: string;
    total_students: number;
    completed_students: number;
    completion_rate: number;
    avg_completion_time_days: number;
  }[];
  engagement_trends: {
    week: string;
    activity_completions: number;
    material_completions: number;
    unique_active_students: number;
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

const getEngagementLevel = (score: number) => {
  if (score >= 80) return { level: 'Alto', color: 'bg-green-100 text-green-800' };
  if (score >= 60) return { level: 'Médio', color: 'bg-yellow-100 text-yellow-800' };
  return { level: 'Baixo', color: 'bg-red-100 text-red-800' };
};

export const ClassroomReports = ({ classroomId }: { classroomId: string }) => {
  const { user } = useContext(IAMContext);
  const { data: reportsData, loading, error, fetch: fetchReports } = useFetch<ClassroomReportsData>('/analytics/classroom-reports');

  useEffect(() => {
    if (user?.id && classroomId) {
      fetchReports({
        name: 'GET',
        url: `/analytics/classroom-reports?teacher_id=${user.id}&classroom_id=${classroomId}`
      });
    }
  }, [user?.id, classroomId, fetchReports]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.overview.total_students}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividades</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.overview.total_activities}</div>
            <p className="text-xs text-muted-foreground">
              {reportsData.overview.activity_completion_rate}% de conclusão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materiais</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.overview.total_materials}</div>
            <p className="text-xs text-muted-foreground">
              {reportsData.overview.material_completion_rate}% de conclusão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontuação Média</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.overview.avg_activity_score}%</div>
            <p className="text-xs text-muted-foreground">Nas atividades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((reportsData.overview.activity_completion_rate + reportsData.overview.material_completion_rate) / 2)}%
            </div>
            <p className="text-xs text-muted-foreground">Conclusão geral</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Performance Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Ranking de Performance dos Alunos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportsData.student_performance.map((student, index) => {
              const engagement = getEngagementLevel(student.overall_engagement);
              return (
                <div key={student.student_id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{student.student_name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Atividades: {student.activities_completed}/{student.total_activities}</span>
                        <span>Materiais: {student.materials_completed}/{student.total_materials}</span>
                        <span>Média: {student.avg_activity_score}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={engagement.color}>
                      {engagement.level} Engajamento
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">{student.overall_engagement}% geral</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Activity and Material Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance das Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData.activity_performance.map((activity) => (
                <div key={activity.activity_id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{activity.activity_name}</h4>
                    <Badge className={getDifficultyColor(activity.difficulty_rating)}>
                      {activity.difficulty_rating === 'Easy' ? 'Fácil' :
                       activity.difficulty_rating === 'Medium' ? 'Médio' : 'Difícil'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Conclusão</p>
                      <p className="font-bold">{activity.completion_rate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Pontuação</p>
                      <p className="font-bold">{activity.average_score}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Alunos</p>
                      <p className="font-bold">{activity.completed_students}/{activity.total_students}</p>
                    </div>
                  </div>
                  <Progress value={activity.completion_rate} className="mt-2 h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Material Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Engajamento com Materiais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData.material_engagement.map((material) => (
                <div key={material.material_id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{material.material_name}</h4>
                      <p className="text-sm text-gray-600">Tipo: {material.material_type}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-bold">{material.completion_rate}%</p>
                      <p className="text-gray-600">{material.avg_completion_time_days} dias</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Alunos: {material.completed_students}/{material.total_students}</span>
                    <span>Tempo médio: {material.avg_completion_time_days} dias</span>
                  </div>
                  <Progress value={material.completion_rate} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tendências de Engajamento (Últimas Semanas)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportsData.engagement_trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="activity_completions" stroke="#10b981" strokeWidth={2} name="Atividades Concluídas" />
              <Line type="monotone" dataKey="material_completions" stroke="#f59e0b" strokeWidth={2} name="Materiais Concluídos" />
              <Line type="monotone" dataKey="unique_active_students" stroke="#ef4444" strokeWidth={2} name="Alunos Ativos" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Scores Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Pontuações</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Excelente (80-100%)', value: reportsData.student_performance.filter(s => s.avg_activity_score >= 80).length },
                    { name: 'Bom (60-79%)', value: reportsData.student_performance.filter(s => s.avg_activity_score >= 60 && s.avg_activity_score < 80).length },
                    { name: 'Regular (40-59%)', value: reportsData.student_performance.filter(s => s.avg_activity_score >= 40 && s.avg_activity_score < 60).length },
                    { name: 'Baixo (<40%)', value: reportsData.student_performance.filter(s => s.avg_activity_score < 40).length },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[0, 1, 2, 3].map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Levels */}
        <Card>
          <CardHeader>
            <CardTitle>Níveis de Engajamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { level: 'Alto', count: reportsData.student_performance.filter(s => s.overall_engagement >= 80).length },
                { level: 'Médio', count: reportsData.student_performance.filter(s => s.overall_engagement >= 60 && s.overall_engagement < 80).length },
                { level: 'Baixo', count: reportsData.student_performance.filter(s => s.overall_engagement < 60).length },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" name="Número de Alunos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
