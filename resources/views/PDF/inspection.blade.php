<!DOCTYPE html>
<html>
<head>
    <style>
      html, body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 10px 25px; }
      .title-area { text-align: right; font-size: 10px; }
      .title-area .insp-no { font-size: 10px; border-bottom: 1px solid #000; padding: 0px 15px; font-weight: bold; }
      .logo img { width: 78%; }
      .header-table { margin-top: 10px;}
      .header-table td { border: 1px solid; text-align: center; }
      .header-table td:nth-child(2) { border-left: 0; border-right: 0; }
      .header-table td:nth-child(3) { text-align: left; padding: 0px 10px; }
      td.header-title { padding: 15px 0px; }
      .form-name { font-size: 19px; margin: 0; margin-bottom: 6px; font-weight: bold; }
      .form-location { font-size: 15px; margin: 0; }
      .form-num { font-size: 11px; margin-bottom: 6px; }
      .rev-no { font-size: 11px; }
      .border { border: 1px solid #000; border-top: 0; padding: 8px; }
      .borders { border: 1px solid #000; border-top: 0; height: 5px; }
      .partAborder { border: 1px solid #000; border-top: 0; padding: 4px 8px; font-size: 14px; background-color: #CECECE; }
      .partAform { border: 1px solid #000; border-top: 0; padding: 8px; font-size: 12px; }
    </style>
</head>
<body>

  @php
    function encodeSignature($fileName) {
        if (!$fileName) return null;

        $fullPath = storage_path('app/public/displayesig/' . $fileName);

        if (!file_exists($fullPath)) {
            return null;
        }

        $type = pathinfo($fullPath, PATHINFO_EXTENSION);
        $data = file_get_contents($fullPath);

        return 'data:image/' . $type . ';base64,' . base64_encode($data);
    }

    $requestorSign = encodeSignature($requestor->esign ?? null);
    $supervisorSign = encodeSignature($supervisor->esign ?? null);
    $gsoSign = encodeSignature($gso->esign ?? null);
    $adminSign = encodeSignature($admin->esign ?? null);
    $assignSign = encodeSignature($assign->esign ?? null);
  @endphp

  @php
    $logo = public_path('images/ppa_logo.png');
    $type = pathinfo($logo, PATHINFO_EXTENSION);
    $data = file_get_contents($logo);
    $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
  @endphp

  {{-- Control Number --}}
  <div class="title-area">
    <span>Control No:</span>
    <span class="insp-no">{{ $inspection->id }}</span>
  </div>

  <table width="100%" cellpadding="0" cellspacing="0">
    {{-- Form Title --}}
    <tr>
      <td width="100%">
        <table class="header-table" width="100%" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td class="logo" width="13%">
                <img src="{{ $base64; }}" alt="My Image" />
              </td>
              <td class="header-title" width="60%">
                <p class="form-name">PRE-REPAIR/POST REPAIR INSPECTION FORM</p>
                <p class="form-location">PMO - LANAO DEL NORTE/ILIGAN</p>
              </td>
              <td class="iso-cert">
                <div class="form-num">Form No.: PM:VEC:LNI:WEN:FM:03</div>
                <div class="rev-no">Revision No.: 00</div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr><td class="borders"></td></tr>
    {{-- Title A --}}
    <tr>
      <td width="100%">
        {{-- Part A --}}
        <table class="partAtable" width="100%" cellpadding="0" cellspacing="0">
          <tr> 
            <td colSpan={3} class="partAborder">
              PART A: To be filled-up by Requesting Party
            </td> 
          </tr>
        </table>
      </td>
    </tr>
    {{-- Form A --}}
    <tr>
      <td class="border">
        <table width="100%" cellpadding="0" cellspacing="0">
          {{-- ================= PART A ================= --}}
          <tr>
            <td width="49%" valign="top">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td colspan="2" height="5"></td></tr>
                {{-- Date --}}
                <tr>
                  <td width="33%" style="font-size:13px;">Date:</td>
                  <td width="67%" style="border-bottom:1px solid #000; padding:0 5px; font-size:13px;">
                      {{ $inspection->created_at->format('F d, Y') }}
                  </td>
                </tr>
                <tr><td colspan="2" height="20"></td></tr>
                {{-- Property Number --}}
                <tr>
                  <td style="font-size:13px;">Property No:</td>
                  <td style="border-bottom:1px solid #000; padding:0 5px; font-size:13px;">
                    {{ $inspection->property_number ?? 'N/A' }}
                  </td>
                </tr>
                <tr><td colspan="2" height="5"></td></tr>
                {{-- Acquisition Date --}}
                <tr>
                  <td style="font-size:13px;">Acquisition Date:</td>
                  <td style="border-bottom:1px solid #000; padding:0 5px; font-size:13px;">
                    {{ $inspection->acquisition_date ? \Carbon\Carbon::parse($inspection->acquisition_date)->format('F d, Y') : 'N/A' }}
                  </td>
                </tr>
                <tr><td colspan="2" height="5"></td></tr>
                {{-- Acquisition Cost --}}
                <tr>
                  <td style="font-size:13px;">Acquisition Cost:</td>
                  <td style="border-bottom:1px solid #000; padding:0 5px; font-size:13px;">
                    {{ $inspection->acquisition_cost 
                      ? '₱ ' . number_format($inspection->acquisition_cost, 2) 
                      : 'N/A' }}
                  </td>
                </tr>
                <tr><td colspan="2" height="5"></td></tr>
                <tr>
                  <td style="font-size:13px;">Brand/Model:</td>
                  <td style="border-bottom:1px solid #000; padding:0 5px; font-size:13px;">
                    {{ $inspection->brand_model ?? 'N/A' }}
                  </td>
                </tr>
                <tr><td colspan="2" height="5"></td></tr>
                <tr>
                  <td style="font-size:13px;">Serial/Engine No.:</td>
                  <td style="border-bottom:1px solid #000; padding:0 5px; font-size:13px;">
                    {{ $inspection->serial_engine_no ?? 'N/A' }}
                  </td>
                </tr>
              </table>
            </td>
            {{-- SPACER --}}
            <td width="2%"></td>
            {{-- RIGHT SIDE --}}
            <td width="49%" valign="top">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td colspan="3" height="35"></td></tr>
                {{-- Type of Property --}}
                <tr>
                  <td width="30%" style="font-size:13px;">Type of Property:</td>
                  <td width="7%" style="border:1px solid #000; text-align:center; font-size:13px;">
                    {{ $inspection->type_of_property == 'Vehicle Supplies & Materials' ? 'X' : '' }}
                  </td>
                  <td width="64%" style="font-size:13px; padding-left:6px;">
                    Vehicle Supplies & Materials
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td style="border:1px solid #000; border-top:0; text-align:center; font-size:13px;">
                    {{ $inspection->type_of_property == 'IT Equipment & Related Materials' ? 'X' : '' }}
                  </td>
                  <td style="font-size:13px; padding-left:6px;">
                    IT Equipment & Related Materials
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td style="border:1px solid #000; border-top:0; text-align:center; font-size:13px;">
                    {{ $inspection->type_of_property == 'Others' ? 'X' : '' }}
                  </td>
                  <td style="font-size:13px; padding-left:6px;">
                    Others
                  </td>
                </tr>
                <tr><td colspan="3" height="5"></td></tr>
                {{-- Description --}}
                <tr>
                  <td style="font-size:13px;">Description:</td>
                  <td colspan="2" style="border-bottom:1px solid #000; padding:0 5px; font-size:13px;">
                    {{ $inspection->property_description }}
                  </td>
                </tr>
                <tr><td colspan="3" height="5"></td></tr>
                {{-- Location --}}
                <tr>
                  <td style="font-size:13px;">Location:</td>
                  <td colspan="2" style="border-bottom:1px solid #000; padding:0 5px; font-size:13px;">
                    {{ $inspection->location }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          {{-- ================= COMPLAIN ================= --}}
          <tr>
            <td colspan="3" height="5"></td>
          </tr>
          <tr>
            <td colspan="3">
              <table width="100%">
                <tr>
                  <td width="15%" style="font-size:13px; padding: 0;">Complain:</td>
                  <td width="85%" style="border-bottom:1px solid #000; padding:0 5px; font-size:13px;">
                    {{ $inspection->complain }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          {{-- ================= SIGNATURE ================= --}}
          <tr>
              <td colspan="3" height="20"></td>
          </tr>
          <tr>
            <td colspan="3">
              <table width="100%">
                <tr>
                  {{-- REQUESTOR --}}
                  <td width="50%" valign="top">
                      <div style="font-size:13px;">
                          REQUESTED BY:
                      </div>

                      <table width="70%" align="center">
                          <tr>
                            <td style="border-bottom:1px solid #000; height:30px; text-align:center; vertical-align:bottom; position: relative;">
                              @if($requestorSign)
                                  <img src="{{ $requestorSign }}" width="70%" style="position: absolute; top: -13px; left: 35px;"><br>
                              @endif
                              <span style="font-size:13px; font-weight:bold;">
                                  {{ strtoupper($inspection->user_name) }}
                              </span>
                            </td>
                          </tr>
                      </table>

                      <div style="font-size:11px; font-style:italic; text-align: center;">
                          End-User
                      </div>
                  </td>

                    {{-- SUPERVISOR --}}
                    <td width="50%" valign="top">
                        <div style="font-size:13px;">
                            NOTED:
                            @if($inspection->form_status == 7)
                                <strong>DISAPPROVED</strong>
                            @endif
                        </div>

                        <table width="70%" align="center">
                            <tr>
                              <td style="border-bottom:1px solid #000; height: 30px; text-align:center; vertical-align:bottom; position: relative;">
                                  @if(!in_array($inspection->form_status, [7, 8, 9, 10, 11]))
                                    <img src="{{ $supervisorSign }}" width="70%" style="position: absolute; top: -13px; left: 35px;"><br>
                                  @endif
                                  <span style="font-size:13px; font-weight:bold;">
                                      {{ strtoupper($inspection->supervisor_name) }}
                                  </span>
                              </td>
                            </tr>
                        </table>

                        <div style="font-size:11px; font-style:italic; text-align: center;">
                            Immediate Supervisor
                        </div>
                    </td>

                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr> 
    {{-- Title B --}}
    <tr>
      <td width="100%">
        {{-- Part B --}}
        <table class="partAtable" width="100%" cellpadding="0" cellspacing="0">
          <tr> 
            <td colSpan={3} class="partAborder">
              PART B: To be filled-up by Administrative Division
            </td> 
          </tr>
        </table>
      </td>
    </tr>
    {{-- Form B --}}
    <tr>
      <td class="border">
        <table width="100%" cellpadding="0" cellspacing="0">
          {{-- ================= PART B ================= --}}
          <tr>
            <td width="100%" valign="top">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td colspan="2" height="5"></td></tr>
                <tr>
                  <td width="20%" style="font-size:13px;">Date:</td>
                  <td width="40%" style="border-bottom:1px solid #000; padding:0 5px; font-size:13px;">
                      {{ $inspection->date_of_filling ? $inspection->date_of_filling->format('F d, Y') : "" }}
                  </td>
                  <td width="40%"></td>
                </tr>
                <tr><td colspan="2" height="5"></td></tr>
                <tr>
                  <td width="20%" style="font-size:13px;">Date of Last Repair:</td>
                  <td width="40%" style="border-bottom:1px solid #000; padding:0 5px; font-size:13px;">
                    {{ $inspection->date_of_filling ? $inspection->date_of_last_repair ? $inspection->date_of_last_repair->format('F d, Y') : 'N/A' : "" }}
                  </td>
                  <td width="40%"></td>
                </tr>
                <tr><td colspan="2" height="5"></td></tr>
                <tr>
                  <td width="20%" style="font-size:13px;">Nature of Last Repair:</td>
                  <td colspan="2" width="80%" style="border-bottom:1px solid #000; padding:0 5px; font-size:13px;">
                      {{ $inspection->date_of_filling ? $inspection->nature_of_last_repair ? $inspection->nature_of_last_repair : "N/A" : "" }}
                  </td>
                </tr>
                {{-- ================= SIGNATURE ================= --}}
                <tr>
                  <td colspan="3" height="20"></td>
                </tr>
                <tr>
                  <td colspan="3">
                    <table width="100%">
                      <tr>
                        {{-- REQUESTOR --}}
                        <td width="50%" valign="top">
                            <div style="font-size:13px;">
                                REQUESTED BY:
                            </div>

                            <table width="70%" align="center">
                                <tr>
                                  <td style="border-bottom:1px solid #000; height:30px; text-align:center; vertical-align:bottom; position: relative;">
                                    @if(!in_array($inspection->form_status, [0, 7]) && $inspection->date_of_filling )
                                        <img src="{{ $gsoSign }}" width="70%" style="position: absolute; top: -13px; left: 35px;"><br>
                                    @endif
                                    <span style="font-size:13px; font-weight:bold;">
                                        {{ strtoupper( $gso->firstname . ' ' .($gso->middlename ? $gso->middlename . '. ' : '') . $gso->lastname )}}
                                    </span>
                                  </td>
                                </tr>
                            </table>

                            <div style="font-size:11px; font-style:italic; text-align: center;">
                                General Service Officer
                            </div>
                        </td>
                        {{-- ADMiN --}}
                        <td width="50%" valign="top">
                            <div style="font-size:12px;">
                                NOTED:
                            </div>

                            <table width="70%" align="center">
                                <tr>
                                  <td style="border-bottom:1px solid #000; height: 30px; text-align:center; vertical-align:bottom; position: relative;">
                                      @if(in_array($inspection->form_status, [1, 2, 3, 4]))
                                        <img src="{{ $adminSign }}" width="70%" style="position: absolute; top: -13px; left: 35px;"><br>
                                      @endif
                                      <span style="font-size:12px; font-weight:bold;">
                                          {{ strtoupper( $admin->firstname . ' ' .($admin->middlename ? $admin->middlename . '. ' : '') . $admin->lastname )}}
                                      </span>
                                  </td>
                                </tr>
                            </table>

                            <div style="font-size:10px; font-style:italic; text-align: center;">
                                Acting Admin Division Manager
                            </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    {{-- Title C --}}
    <tr>
      <td width="100%">
        {{-- Part C --}}
        <table class="partAtable" width="100%" cellpadding="0" cellspacing="0">
          <tr> 
            <td colSpan={3} class="partAborder">
              PART C: To be filled-up by the DESIGNATED INSPECTOR before repair job.
            </td> 
          </tr>
        </table>
      </td>
    </tr>
    {{-- Form C --}}
    <tr>
      <td class="border">
        <table width="100%" cellpadding="0" cellspacing="0">
          {{-- ================= PART C ================= --}}
          <tr>
            <td width="100%" valign="top">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td colspan="2" height="5"></td></tr>
                <tr>
                  <td width="18%" style="font-size:13px;">Finding/s:</td>
                  <td width="82%" style="border-bottom:1px solid #000; padding:0 5px; font-size:13px;">
                    {{ $inspection->before_repair_date ? $inspection->findings : "" }}
                  </td>
                </tr>
                <tr><td colspan="2" height="5"></td></tr>
                <tr>
                  <td width="18%" style="font-size:13px;">Recommendation/s:</td>
                  <td width="82%" style="border-bottom:1px solid #000; padding:0 5px; font-size:13px;">
                      {{ $inspection->before_repair_date ? $inspection->recommendations : "" }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          {{-- ================= SIGNATURE ================= --}}
          <tr>
            <td colspan="3" height="20"></td>
          </tr>
          <tr>
            <td colspan="3">
              <table width="100%">
                <tr>
                  {{-- REQUESTOR --}}
                  <td width="50%" valign="top">
                      <div style="font-size:13px;">
                          DATE INSPECTED:
                      </div>

                      <table width="70%" align="center">
                          <tr>
                            <td style="border-bottom:1px solid #000; height:40px; text-align:center; vertical-align:bottom; position: relative;">
                              <span style="font-size:14px; font-weight:bold;">
                                  {{ $inspection->before_repair_date ? $inspection->before_repair_date->format('F d, Y') : "" }}
                              </span>
                            </td>
                          </tr>
                      </table>
                  </td>
                  {{-- SUPERVISOR --}}
                  <td width="50%" valign="top">
                      <div style="font-size:13px;">
                          ACCOMPLISHED BY:
                      </div>
                      <table width="70%" align="center">
                          <tr>
                            <td style="border-bottom:1px solid #000; height: 40px; text-align:center; vertical-align:bottom; position: relative;">
                                @if(in_array($inspection->form_status, [1, 2, 3, 4, 6, 11]) && $inspection->personnel_name && $inspection->before_repair_date)
                                  <img src="{{ $assignSign }}" width="70%" style="position: absolute; top: -13px; left: 35px;"><br>
                                @endif
                                <span style="font-size:13px; font-weight:bold;">
                                    {{ $inspection->personnel_name ? strtoupper( $inspection->personnel_name ) : ""}}
                                </span>
                            </td>
                          </tr>
                      </table>
                      <div style="font-size:11px; font-style:italic; text-align: center;">
                          Property Inspector
                      </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    {{-- Title D --}}
    <tr>
      <td width="100%">
        {{-- Part D --}}
        <table class="partAtable" width="100%" cellpadding="0" cellspacing="0">
          <tr> 
            <td colSpan={3} class="partAborder">
              PART D: To be filled-up by the DESIGNATED INSPECTOR after the completion of the repair job.
            </td> 
          </tr>
        </table>
      </td>
    </tr>
    {{-- Form D --}}
    <tr>
      <td class="border">
        <table width="100%" cellpadding="0" cellspacing="0">
          {{-- ================= PART C ================= --}}
          <tr>
            <td width="100%" valign="top">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td colspan="2" height="5"></td></tr>

                <tr>
                  <td width="18%" style="font-size:13px;">Remarks/s:</td>
                  <td width="82%" style="border-bottom:1px solid #000; padding:0 5px; font-size:13px;">
                      {{ $inspection->after_reapir_date ? $inspection->remarks : "" }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          {{-- ================= SIGNATURE ================= --}}
          <tr>
            <td colspan="3" height="20"></td>
          </tr>
          <tr>
            <td colspan="3">
              <table width="100%">
                <tr>
                  {{-- REQUESTOR --}}
                  <td width="50%" valign="top">
                      <div style="font-size:13px;">
                          DATE INSPECTED:
                      </div>

                      <table width="70%" align="center">
                          <tr>
                            <td style="border-bottom:1px solid #000; height:40px; text-align:center; vertical-align:bottom; position: relative;">
                              <span style="font-size:14px; font-weight:bold;">
                                  {{ $inspection->after_reapir_date ? $inspection->after_reapir_date->format('F d, Y') : "" }}
                              </span>
                            </td>
                          </tr>
                      </table>
                  </td>

                  {{-- SUPERVISOR --}}
                  <td width="50%" valign="top">
                      <div style="font-size:13px;">
                          ACCOMPLISHED BY:
                      </div>

                      <table width="70%" align="center">
                          <tr>
                            <td style="border-bottom:1px solid #000; height: 40px; text-align:center; vertical-align:bottom; position: relative;">
                                @if(in_array($inspection->form_status, [1, 2, 4, 11]) && $inspection->personnel_name && $inspection->after_reapir_date)
                                  <img src="{{ $assignSign }}" width="70%" style="position: absolute; top: -13px; left: 35px;"><br>
                                @endif
                                <span style="font-size:13px; font-weight:bold;">
                                    {{ $inspection->personnel_name ? strtoupper( $inspection->personnel_name ) : ""}}
                                </span>
                            </td>
                          </tr>
                      </table>

                      <div style="font-size:11px; font-style:italic; text-align: center;">
                          Property Inspector
                      </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td width="100%" style="font-size: 11px; color: #808080; font-style: italic;">
        Job Order Management System - This is system-generated.
      </td>
    </tr> 
  </table>
</body>
</html>