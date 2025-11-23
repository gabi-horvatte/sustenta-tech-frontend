import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { materialsContent } from '@/materials';

export const Materials = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-bold text-center text-lime-700/80">Painel do professor</h1>
        <h5 className="text-xl font-bold text-center text-yellow-900/80">Materiais</h5>
      </div> */}
      {(materialsContent?.length ?? 0) > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {materialsContent?.map((material) => (
            <Card
              key={material.id}
              className="grid grid-rows-2 justify-between bg-lime-700/80 flex flex-col p-0 m-0 cursor-pointer hover:bg-lime-700/60 transition-all duration-150"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(material.url, '_blank');
              }}

            >
              <CardContent>
                <h5 className="text-lg font-bold text-white text-center">{material.title}</h5>
              </CardContent>
              <CardFooter className="bg-white items-center flex-col p-2">
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
