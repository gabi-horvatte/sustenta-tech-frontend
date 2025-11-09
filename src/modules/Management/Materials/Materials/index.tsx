import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { materialsData } from './const';

export const Materials = () => {
  return (
    <div className="max-w-[40vw] mx-auto flex flex-col gap-8 pt-8 pb-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-bold text-center text-lime-700/80">Painel administrativo</h1>
        <h5 className="text-xl font-bold text-center text-yellow-900/80">Materiais</h5>
      </div>
      {(materialsData?.length ?? 0) > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {materialsData?.map((material) => (
            <Card
              key={material.name}
              className="bg-lime-700/80 flex flex-col p-0 m-0 cursor-pointer hover:bg-lime-700/60 transition-all duration-150"
              // onClick={() => navigate(`/management/activities/activity/${material.id}?name=${material.name}&description=${material.description}&classroom_name=${material.classroom_name}`)}

            >
              <CardContent>
                <h5 className="text-lg font-bold text-white text-center">{material.name}</h5>
              </CardContent>
              <CardFooter className="bg-white items-center flex-col">
              {material.authorNames.length > 0 && (
                    material.authorNames.map((authorName) => (
                      <p className="text-sm text-yellow-900/90 text-center">
                        {authorName}
                      </p>
                    ))
                  )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (<></>)}
    </div>
  )
}
