import PageComponent from "../../components/PageComponent";

export default function DashboardAMS(){
  return (
    <PageComponent title="Dashboard">

      {/* Form Count */}
      <div className="grid grid-cols-3 gap-4">

        {/* Motor Vehicles */}
        <div className="col-span-1 ppa-widget">
          <div className="joms-dashboard-title"> Motor Vehicles </div>
          <div className="joms-count">8</div>
          <div className="joms-word-count">Total Count</div>
        </div>

        {/* Information Communication Technology */}
        <div className="col-span-1 ppa-widget">
          <div className="joms-dashboard-title"> Information Communication Technology </div>
          <div className="joms-count">2</div>
          <div className="joms-word-count">Total Count</div>
        </div>

        {/* Information Communication Technology */}
        <div className="col-span-1 ppa-widget">
          <div className="joms-dashboard-title"> Land, Building & Structures </div>
          <div className="joms-count">16</div>
          <div className="joms-word-count">Total Count</div>
        </div>

      </div>

    </PageComponent>
  );
}