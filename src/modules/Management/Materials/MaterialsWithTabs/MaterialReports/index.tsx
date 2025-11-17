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
  FileText, 
  Users, 
  Target, 
  Clock,
  BookOpen,
  Calendar,
  Trophy,
  TrendingUp,
  Layers
} from 'lucide-react';

type MaterialReportsData = {
  overview: {
    total_materials: number;
    total_assignments: number;
    total_completions: number;
    completion_rate: number;
  };
  student_engagement: {
    student_id: string;
    student_name: string;
    total_materials: number;
    completed_materials: number;
    completion_rate: number;
    avg_completion_time_days: number;
  }[];
  classroom_engagement: {
    classroom_id: string;
    classroom_name: string;
    total_students: number;
    total_assignments: number;
    completion_rate: number;
    avg_completion_time_days: number;
  }[];
  material_effectiveness: {
    material_id: string;
    material_name: string;
    material_type: string;
    authors: string;
    total_assignments: number;
    completion_rate: number;
    avg_completion_time_days: number;
    popularity_rating: 'High' | 'Medium' | 'Low';
  }[];
  material_type_analysis: {
    material_type: string;
    total_materials: number;
    completion_rate: number;
    avg_completion_time_days: number;
  }[];
  monthly_trends: {
    month: string;
    total_assignments: number;
    total_completions: number;
    completion_rate: number;
    unique_students: number;
  }[];
};

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const getPopularityColor = (rating: string) => {
  switch (rating) {
    case 'High': return 'bg-green-100 text-green-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'Low': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getMaterialTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'video': return '🎥';
    case 'document': return '📄';
    case 'presentation': return '📊';
    case 'link': return '🔗';
    default: return '📚';
  }
};

export const MaterialReports = () => {
  const { user } = useContext(IAMContext);
  const { data: reportsData, loading, error, fetch: fetchReports } = useFetch<MaterialReportsData>('/analytics/material-reports');

  useEffect(() => {
    if (user?.id) {
      fetchReports({
        name: 'GET',
        url: `/analytics/material-reports?teacher_id=${user.id}`
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
            <CardTitle className="text-sm font-medium">Total de Materiais</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.overview.total_materials}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atribuições</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.overview.total_assignments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Conclusões</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.overview.total_completions}</div>
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
      <Tabs defaultValue="engagement" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="engagement">Engajamento</TabsTrigger>
          <TabsTrigger value="effectiveness">Efetividade</TabsTrigger>
          <TabsTrigger value="types">Tipos</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="classrooms">Turmas</TabsTrigger>
        </TabsList>

        {/* Student and Classroom Engagement */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Engagement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Top 10 Alunos Mais Engajados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportsData.student_engagement.slice(0, 10).map((student, index) => (
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
                            {student.completed_materials}/{student.total_materials} materiais • 
                            {student.avg_completion_time_days > 0 ? ` ${student.avg_completion_time_days} dias média` : ' Sem conclusões'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{student.completion_rate}%</p>
                        <Progress value={student.completion_rate} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Classroom Engagement Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Engajamento por Turma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportsData.classroom_engagement.slice(0, 8)}>
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
                    <Bar dataKey="completion_rate" fill="#10b981" name="Taxa de Conclusão %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Material Effectiveness */}
        <TabsContent value="effectiveness" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Efetividade dos Materiais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.material_effectiveness.map((material) => (
                  <div key={material.material_id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          <span>{getMaterialTypeIcon(material.material_type)}</span>
                          {material.material_name}
                        </h4>
                        <p className="text-sm text-gray-600">Autores: {material.authors}</p>
                      </div>
                      <Badge className={getPopularityColor(material.popularity_rating)}>
                        {material.popularity_rating === 'High' ? 'Alta' :
                         material.popularity_rating === 'Medium' ? 'Média' : 'Baixa'} Popularidade
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Atribuições</p>
                        <p className="font-bold">{material.total_assignments}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Taxa de Conclusão</p>
                        <p className="font-bold">{material.completion_rate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tempo Médio</p>
                        <p className="font-bold">{material.avg_completion_time_days} dias</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tipo</p>
                        <p className="font-bold">{material.material_type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Material Type Analysis */}
        <TabsContent value="types" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Type Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Distribuição por Tipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportsData.material_type_analysis}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props: any) => `${props.material_type}: ${props.total_materials}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total_materials"
                    >
                      {reportsData.material_type_analysis.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Type Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Performance por Tipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportsData.material_type_analysis.map((type) => (
                    <div key={type.material_type} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getMaterialTypeIcon(type.material_type)}</span>
                          <div>
                            <h4 className="font-medium">{type.material_type}</h4>
                            <p className="text-sm text-gray-600">{type.total_materials} materiais</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{type.completion_rate}%</p>
                          <p className="text-sm text-gray-600">{type.avg_completion_time_days} dias</p>
                        </div>
                      </div>
                      <Progress value={type.completion_rate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
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
                  <Bar yAxisId="left" dataKey="total_assignments" fill="#10b981" name="Atribuições" />
                  <Bar yAxisId="left" dataKey="total_completions" fill="#f59e0b" name="Conclusões" />
                  <Line yAxisId="right" type="monotone" dataKey="completion_rate" stroke="#ef4444" strokeWidth={3} name="Taxa de Conclusão %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classroom Details */}
        <TabsContent value="classrooms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportsData.classroom_engagement.map((classroom) => (
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
                      <span className="text-gray-600">Taxa de Conclusão</span>
                      <span className="font-bold">{classroom.completion_rate}%</span>
                    </div>
                    <Progress value={classroom.completion_rate} className="h-2" />
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tempo Médio de Conclusão</span>
                      <span className="font-bold">{classroom.avg_completion_time_days} dias</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total de Atribuições</span>
                      <span className="font-bold">{classroom.total_assignments}</span>
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
