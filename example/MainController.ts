
import {
    BaseController, IObservableThing, ObservableThing, ObservableThingProperty,
    EventArgs
} from "tnx-core/dist/tnx-core";
import {DialogOptions, IDialogCommand} from "../src/interfaces";



enum UniverseState {
    ok, destroyed
}

enum UniverseDestructorState {
    ready, inProgress, cancelled, completed
}

interface Universe extends IObservableThing{
    state: UniverseState ;
}

class SomeUniverse extends ObservableThing implements  Universe {

    @ObservableThingProperty
    state= UniverseState.ok;
}

export class MainController extends BaseController {

    destroyer = new UniverseDestroyer() ;

    universe =  new SomeUniverse();

    static $inject = [ '$scope' ];

    mesasge = 'hello';
    
    constructor($scope) {

        super($scope);

        var destroyerStateChanged = this.destroyer.xEvents
            .asObservable()
            .where( e=> e.args.key == "state");

        this.disposables.add(
            destroyerStateChanged
                .where(e=> e.args.value == UniverseDestructorState.completed)
                .subscribe(()=>{
                    this.universe.state = UniverseState.destroyed;
                })
        );

        this.disposables.add(
            this.destroyer.xEvents.asObservable()
                .where(e=>e.args.key =="countDown")
                .select(e=>e.args.value)
                .subscribe(countDown=>{
                    console.log(`Universe will be destroyed in ${countDown} seconds...`);
                    $scope.$apply();
                })
        )
    }

    execute(what){

        what = what || (
                this.destroyer.state == UniverseDestructorState.inProgress
                    ? 'cancel'
                    : 'destroy'
            );

        switch (what) {
            case 'destroy':
                this.destroyTheUniverse();
                break;

            case 'cancel':
                this.destroyer.cancel();
                break;
        }
    }
    destroyTheUniverse() {

        if(this.universe.state == UniverseState.destroyed){
            this.raiseEvent('show', {
                idx: 'universe-destroy-dialog',
                header: 'Sorry'
            });
            return;
        }

        this.raiseEvent('show',
            <DialogOptions>{
                idx: 'universe-destroy-dialog',
                header: 'confim',
                commands: <IDialogCommand[]> [
                    this.destroyCommand,
                    this.cancelDestructionCommand
                ]
            });
    }

    destroyCommand =  {
        text: 'ok',
        exec: x => {
            this.destroyer.destroy();
            //return close
            return true;
        },
        canExec: x=> this.universe.state != UniverseState.destroyed
    };

    cancelDestructionCommand  = {
        text: 'cancel',
        exec: x => {
            this.destroyer.cancel();
            //let know dialog can close
            return true;
        }
    };

}

class UniverseDestroyer extends ObservableThing{

    @ObservableThingProperty
    state: UniverseDestructorState = UniverseDestructorState.ready;

    @ObservableThingProperty
    countDown ;

    pauser = new Rx.Subject<boolean>()

    constructor() {
        super();

        Rx.Observable.interval(500)
            .timeInterval()
            .take(11)
            .pausable(this.pauser)
            .subscribe(e=>{
                this.countDown = 10 - e.value ;
            });

        this.disposables.add(
            this.xEvents.asObservable()
            //.distinct(e=>e.args.value)
                .where(e=>e.args.key == 'state'
                    && e.args.value == UniverseDestructorState.inProgress
                )
                .subscribe(()=>{
                    this.pauser.onNext(true)
                })
        );

        this.disposables.add(
            this.xEvents.asObservable()
            //.distinct(e=>e.args.value)
                .where(e=>e.args.key == 'state'
                    && e.args.value == UniverseDestructorState.cancelled
                )
                .subscribe(()=>{
                    this.pauser.onNext(false)
                })
        );


        this.disposables.add(
            this.xEvents.asObservable()
                .where(this.isCuntDownCompleted)
                .subscribe(this.onCountDownCompleted)
        );
    }

    isCountDownInProgress(count:number): (e:EventArgs)=> boolean {
        return (e)=>
        this.state != UniverseDestructorState.cancelled
        && count >= 0;
    }

    isCuntDownCompleted(e:EventArgs): boolean {
        return e.args.key == 'countDown'
            && e.args.value == 0;
    }
    onCountDownCompleted = ()=>{
        this.state = UniverseDestructorState.completed
    };

    destroy(){
        this.state = UniverseDestructorState.inProgress;
    }

    cancel(){
        this.state = UniverseDestructorState.cancelled
    }
}