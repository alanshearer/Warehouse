module Global {

    export class Configuration {

      static get serviceHost() {
            return '/api/';
        }
    }

   
    
   export function mergeKeyValuePair(destination: dto.IKeyValuePair[], source: dto.IKeyValuePair[]): Array<dto.IKeyValuePair> {

        if (angular.isUndefined(source) || source == null) return destination;

        if (angular.isUndefined(destination) || destination == null)
            destination = new Array<dto.IKeyValuePair>();

        angular.forEach(source, (item: dto.IKeyValuePair) => {
            if (!Enumerable.from(destination).any((r) => r.value == item.value)) {
                destination.push(item);
            }
        });
        //return Enumerable.from(destination).orderBy((r) => r.key).toArray();
       return Enumerable.from(destination).toArray();
    }
}