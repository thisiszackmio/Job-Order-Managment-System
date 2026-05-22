<!DOCTYPE html>
<html>
<head>
    <style>
      html, body { font-family: Arial, Helvetica, sans-serif; margin: 0; }
      .title-area { text-align: right; font-size: 10px; }
      .title-area .insp-no { font-size: 10px; border-bottom: 1px solid #000; padding: 0px 15px; font-weight: bold; }
      .logo img { width: 78%; }
      .header-table { margin-top: 5px;}
      .header-table td { border: 1px solid; text-align: center; }
      .header-table td:nth-child(2) { border-left: 0; border-right: 0; }
      .header-table td:nth-child(3) { text-align: left; padding: 0px 5px; }
      td.header-title { padding: 10px 0px; }
      .form-name { font-size: 16px; margin: 0; margin-bottom: 3px; font-weight: bold; }
      .form-location { font-size: 10px; margin: 0; }
      .form-num { font-size: 9px; margin-bottom: 6px; }
      .rev-no { font-size: 9px; }
      .pdf-footer {
        text-align:left;
        font-size: 11px;
        color: #808080;
        font-style: italic;
        padding: 10px;
      }
      .joms-fixed {
        position: fixed;
        bottom: 0;
      }
    </style>
</head>
<body>
  @php
    $logo = public_path('images/ppa_logo.png');
    $type = pathinfo($logo, PATHINFO_EXTENSION);
    $data = file_get_contents($logo);
    $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
  @endphp

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
    $driverSign = encodeSignature($driver->esign ?? null);
    $adminSign = encodeSignature($admin->esign ?? null);
    $portmanagerSign = encodeSignature($pm->esign ?? null);
  @endphp

  @php
    preg_match('/^(.*)\s\(([^)]+)\)$/', $vehicle->vehicle_type, $matches);
    $vehicleName = $matches[1] ?? '';
    $plateNumber = $matches[2] ?? '';
  @endphp

  @php
    $rawPassengers = $vehicle->passengers;

    $passengers = ($rawPassengers === "None" || !$rawPassengers)
      ? []
      : preg_split('/\r\n|\r|\n/', $rawPassengers);

    $passengers = array_values(array_filter(array_map('trim', $passengers)));

    // 🔥 LIMIT TOTAL PASSENGERS (e.g. max 12)
    $maxTotal = 16;
    $passengers = array_slice($passengers, 0, $maxTotal);

    // Now split into 2 columns
    $half = ceil(count($passengers) / 2);

    $col1 = array_slice($passengers, 0, $half);
    $col2 = array_slice($passengers, $half);

    // Optional: pad for clean layout
    $maxRows = max(count($col1), count($col2));
    $col1 = array_pad($col1, $maxRows, '');
    $col2 = array_pad($col2, $maxRows, '');
  @endphp

  <table width="100%">
    <tr>
      <!-- LEFT COPY -->
      <td width="50%" style="padding: 5px 12px;">
        {{-- Control Number --}}
        <div class="title-area">
          <span>Slip No:</span>
          <span class="insp-no">{{ $vehicle->id }}</span>
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
                    <td class="header-title" width="52%">
                      <p class="form-name">VEHICLE REQUEST SLIP</p>
                      <p class="form-location">PMO - LANAO DEL NORTE/ILIGAN</p>
                    </td>
                    <td class="iso-cert">
                      <div class="form-num">Doc.Ref.Code: PM:VEC:LNI:WEN:FM:01</div>
                      <div class="rev-no">Revision No.: 00</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {{-- Header --}}
          <tr>
            <td width="100%">
              <div style="text-align: center; font-size: 12px; padding-top: 10px;">
                <p style="margin:0;">Republic of the Philippines</p>
                <p style="margin:1px;"><b>PHILIPPINE PORTS AUTHORITY</b></p>
                <p style="margin:1px;">PMO-<u>Lanao Del Norte/Iligan</u></p>
              </div>
            </td>
          </tr>
          {{-- Date --}}
          <tr>
            <td width="100%">
              <div style="text-align: right;">
                
                <div style="display: inline-block; text-align: center;">
                  
                  <!-- Underlined Date -->
                  <span style="
                    display: inline-block;
                    border-bottom: 1px solid #000;
                    min-width: 150px;
                    padding-bottom: 2px;
                    font-size: 12px;
                  ">
                    {{ \Carbon\Carbon::parse($vehicle->created_at)->format('F d, Y') }}
                  </span>

                  <!-- Label -->
                  <div style="font-size: 12px;">
                    Date
                  </div>

                </div>

              </div>
            </td>
          </tr>
          {{-- Chicka --}}
          <tr>
            <td width="100%">
              <div style="text-align: center; font-size: 13px; margin:0;">
                <b>VEHICLE REQUEST SLIP</b>
              </div>
              <div style="text-align: left; font-size: 13px; padding-top: 10px; margin:0;">
                Provision of service vehicle/s for official use of personnel is requested with the
                following details:
              </div>
            </td>
          </tr>
          <!-- SPACE -->
          <tr><td height="5"></td></tr>
          {{-- Passengers --}}
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="22%" valign="top" style="font-size:13px;">
                    <!-- Label -->
                    <strong>PASSENGERS/s:</strong>
                  </td>
                  <!-- Data -->
                  <td width="78%">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      @if(count($passengers) === 0)
                        <!-- Empty line -->
                        <div style="border-bottom:1px solid #000; height:16px;"></div>
                      @else
                        <table width="100%" cellpadding="0" cellspacing="0">
                          @for($i = 0; $i < $maxRows; $i++)
                            <tr>
                              <!-- Left Column -->
                              <td width="50%" style="border-bottom:1px solid #000; height:18px; font-size:12px;">
                                @if(!empty($col1[$i]))
                                  {{ $i + 1 }}. {{ $col1[$i] }}
                                @endif
                              </td>

                              <!-- Right Column -->
                              <td width="50%" style="border-bottom:1px solid #000; height:18px; font-size:12px;">
                                @if(!empty($col2[$i]))
                                  {{ $i + 1 + $half }}. {{ $col2[$i] }}
                                @endif
                              </td>
                            </tr>
                          @endfor
                        </table>
                      @endif
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- SPACE -->
          <tr><td height="5"></td></tr>
          {{-- Purpose --}}
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="22%" valign="top" style="padding-top:3px; font-size:13px;">
                    <strong>PURPOSE:</strong>
                  </td>
                  <td width="78%" style="border-bottom:1px solid #000; padding-left:5px; font-size:12px;">
                    {{ $vehicle->purpose ?? '' }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- SPACE -->
          <tr><td height="5"></td></tr>
          {{-- Place --}}
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="31%" valign="top" style="padding-top:3px; font-size:13px;">
                    <strong>PLACE/s TO BE VISITED:</strong>
                  </td>
                  <td width="69%" style="border-bottom:1px solid #000; padding-left:5px; font-size:12px;">
                    {{ $vehicle->place_visited }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- SPACE -->
          <tr><td height="5"></td></tr>
          {{-- Date and Time --}}
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="31%" valign="top" style="font-size:13px;">
                    <strong>DATE/TIME OF ARRIVAL:</strong>
                  </td>
                  <td width="69%" style="border-bottom:1px solid #000; padding-left:5px; font-size:12px;">
                    {{ \Carbon\Carbon::parse($vehicle->date_arrival)->format('F d, Y') }}
                    @
                    {{ \Carbon\Carbon::parse($vehicle->time_arrival)->format('h:i A') }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- SPACE -->
          <tr><td height="25"></td></tr>
          {{-- Driver and Vehicle --}}
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <!-- Vehicle -->
                <td width="33%" style="padding-right: 10px;">
                  <div style="border-bottom:1px solid #000; text-align: center; font-size:12px;">
                    {{ $vehicleName }}
                  </div>
                  <div style="font-size:13px; text-align: center; margin-top:3px;">Type of Vehicle</div>
                </td>

                <!-- Plate -->
                <td width="33%" style="padding:0 10px;">
                  <div style="text-align: center; border-bottom:1px solid #000; font-size:12px;">
                    {{ $plateNumber }}
                  </div>
                  <div style="text-align: center; font-size:13px; margin-top:3px;">Plate No.</div>
                </td>

                <!-- Driver -->
                <td width="33%">
                  <div style="position:relative; padding-left: 10px;">
                    @if(in_array($vehicle->admin_approval, [1, 2, 10, 11]))
                      <img src="{{ $driverSign }}" width="100%" style="position:absolute; top: -40px; left:5%;">
                    @endif
                  </div>
                  <div style="text-align: center; border-bottom:1px solid #000; font-size:12px;">
                    {{ $vehicle->driver }}
                  </div>
                  <div style="text-align: center; font-size:13px; margin-top:3px;">Driver</div>
                </td>
              </table>
            </td>
          </tr>
          <!-- SPACE -->
          <tr><td colspan="2" height="15"></td></tr>
          {{-- Requestor --}}
          <tr>
            <td colspan="2">
              <table width="50%">
                <tr>
                  <td>
                    <div style="font-size:13px;">
                      <strong>REQUESTED BY:</strong>
                    </div>

                    <div style="border-bottom:1px solid #000; height:35px; text-align:center; position:relative; margin-top:5px;">

                      {{-- Signature --}}
                      @if($requestorSign)
                        <img 
                          src="{{ $requestorSign }}" 
                          style="position:absolute; top:-15px; left:50%; transform:translateX(-50%); z-index:1; width:160px;"
                        >
                      @endif

                      {{-- Name (force above bottom line but below signature) --}}
                      <div style="position:absolute; bottom:2px; width:100%; z-index:2;">
                        <span style="font-size:12px; font-weight:bold;">
                          {{ strtoupper($vehicle->user_name) }}
                        </span>
                      </div>

                    </div>

                    <div style="text-align:center; font-size:12px; margin-top:2px;">
                      {{ $requestor->position }}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- SPACE -->
          <tr><td colspan="2" height="10"></td></tr>
          {{-- Admin or PortManager --}}
          <tr>
            <td colspan="2">
              <table width="50%">
                <tr>
                  <td>
                    <div style="font-size:13px;">
                      <strong>
                        @if($vehicle->admin_approval === 2)
                          APPROVED:
                        @elseif($vehicle->admin_approval === 3)
                          DISAPPROVED:
                        @else
                          APPROVED:
                        @endif
                      </strong>
                    </div>

                    {{-- Esig and name --}}
                    <div style="border-bottom:1px solid #000; height:35px; text-align:center; position:relative;">
                      @if(in_array($vehicle->admin_approval, [1, 2]))
                        @if($vehicle->type_of_slip === 'within')
                        <img src="{{ $adminSign }}" style="position:absolute; top:-15px; left:50%; transform:translateX(-50%); z-index:1; width:160px;">
                        @else
                        <img src="{{ $portmanagerSign }}" style="position:absolute; top:-15px; left:50%; transform:translateX(-50%); z-index:1; width:160px;">
                        @endif
                      @endif

                      {{-- Name (force above bottom line but below signature) --}}
                      <div style="position:absolute; bottom:2px; width:100%; z-index:2;">
                        <span style="font-size:13px; font-weight:bold;">
                          @if($vehicle->type_of_slip === 'within')
                          {{ strtoupper($admin->firstname . ' ' .($admin->middlename ? $admin->middlename . '. ' : '') . $admin->lastname) }}
                          @else
                          {{ strtoupper($pm->firstname . ' ' .($pm->middlename ? $pm->middlename . '. ' : '') . $pm->lastname) }}
                          @endif
                        </span>
                      </div>
                    </div>

                    <div style="text-align:center; font-size:12px; margin-top:2px;">
                      @if($vehicle->type_of_slip === 'within')
                      {{ $admin->position }}
                      @else
                      {{ $pm->position }}
                      @endif
                    </div>

                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>

      <!-- RIGHT COPY -->
      <td width="50%"  style="padding: 5px 12px;">
        {{-- Control Number --}}
        <div class="title-area">
          <span>Slip No:</span>
          <span class="insp-no">{{ $vehicle->id }}</span>
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
                    <td class="header-title" width="52%">
                      <p class="form-name">VEHICLE REQUEST SLIP</p>
                      <p class="form-location">PMO - LANAO DEL NORTE/ILIGAN</p>
                    </td>
                    <td class="iso-cert">
                      <div class="form-num">Doc.Ref.Code: PM:VEC:LNI:WEN:FM:01</div>
                      <div class="rev-no">Revision No.: 00</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {{-- Header --}}
          <tr>
            <td width="100%">
              <div style="text-align: center; font-size: 12px; padding-top: 10px;">
                <p style="margin:0;">Republic of the Philippines</p>
                <p style="margin:1px;"><b>PHILIPPINE PORTS AUTHORITY</b></p>
                <p style="margin:1px;">PMO-<u>Lanao Del Norte/Iligan</u></p>
              </div>
            </td>
          </tr>
          {{-- Date --}}
          <tr>
            <td width="100%">
              <div style="text-align: right;">
                
                <div style="display: inline-block; text-align: center;">
                  
                  <!-- Underlined Date -->
                  <span style="
                    display: inline-block;
                    border-bottom: 1px solid #000;
                    min-width: 150px;
                    padding-bottom: 2px;
                    font-size: 12px;
                  ">
                    {{ \Carbon\Carbon::parse($vehicle->created_at)->format('F d, Y') }}
                  </span>

                  <!-- Label -->
                  <div style="font-size: 12px;">
                    Date
                  </div>

                </div>

              </div>
            </td>
          </tr>
          {{-- Chicka --}}
          <tr>
            <td width="100%">
              <div style="text-align: center; font-size: 13px; margin:0;">
                <b>VEHICLE REQUEST SLIP</b>
              </div>
              <div style="text-align: left; font-size: 13px; padding-top: 10px; margin:0;">
                Provision of service vehicle/s for official use of personnel is requested with the
                following details:
              </div>
            </td>
          </tr>
          <!-- SPACE -->
          <tr><td height="5"></td></tr>
          {{-- Passengers --}}
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="22%" valign="top" style="font-size:13px;">
                    <!-- Label -->
                    <strong>PASSENGERS/s:</strong>
                  </td>
                  <!-- Data -->
                  <td width="78%">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      @if(count($passengers) === 0)
                        <!-- Empty line -->
                        <div style="border-bottom:1px solid #000; height:16px;"></div>
                      @else
                        <table width="100%" cellpadding="0" cellspacing="0">
                          @for($i = 0; $i < $maxRows; $i++)
                            <tr>
                              <!-- Left Column -->
                              <td width="50%" style="border-bottom:1px solid #000; height:18px; font-size:12px;">
                                @if(!empty($col1[$i]))
                                  {{ $i + 1 }}. {{ $col1[$i] }}
                                @endif
                              </td>

                              <!-- Right Column -->
                              <td width="50%" style="border-bottom:1px solid #000; height:18px; font-size:12px;">
                                @if(!empty($col2[$i]))
                                  {{ $i + 1 + $half }}. {{ $col2[$i] }}
                                @endif
                              </td>
                            </tr>
                          @endfor
                        </table>
                      @endif
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- SPACE -->
          <tr><td height="5"></td></tr>
          {{-- Purpose --}}
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="22%" valign="top" style="padding-top:3px; font-size:13px;">
                    <strong>PURPOSE:</strong>
                  </td>
                  <td width="78%" style="border-bottom:1px solid #000; padding-left:5px; font-size:12px;">
                    {{ $vehicle->purpose ?? '' }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- SPACE -->
          <tr><td height="5"></td></tr>
          {{-- Place --}}
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="31%" valign="top" style="padding-top:3px; font-size:13px;">
                    <strong>PLACE/s TO BE VISITED:</strong>
                  </td>
                  <td width="69%" style="border-bottom:1px solid #000; padding-left:5px; font-size:12px;">
                    {{ $vehicle->place_visited }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- SPACE -->
          <tr><td height="5"></td></tr>
          {{-- Date and Time --}}
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="31%" valign="top" style="font-size:13px;">
                    <strong>DATE/TIME OF ARRIVAL:</strong>
                  </td>
                  <td width="69%" style="border-bottom:1px solid #000; padding-left:5px; font-size:12px;">
                    {{ \Carbon\Carbon::parse($vehicle->date_arrival)->format('F d, Y') }}
                    @
                    {{ \Carbon\Carbon::parse($vehicle->time_arrival)->format('h:i A') }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- SPACE -->
          <tr><td height="25"></td></tr>
          {{-- Driver and Vehicle --}}
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <!-- Vehicle -->
                <td width="33%" style="padding-right: 10px;">
                  <div style="border-bottom:1px solid #000; text-align: center; font-size:12px;">
                    {{ $vehicleName }}
                  </div>
                  <div style="font-size:13px; text-align: center; margin-top:3px;">Type of Vehicle</div>
                </td>

                <!-- Plate -->
                <td width="33%" style="padding:0 10px;">
                  <div style="text-align: center; border-bottom:1px solid #000; font-size:12px;">
                    {{ $plateNumber }}
                  </div>
                  <div style="text-align: center; font-size:13px; margin-top:3px;">Plate No.</div>
                </td>

                <!-- Driver -->
                <td width="33%">
                  <div style="position:relative; padding-left: 10px;">
                    @if(in_array($vehicle->admin_approval, [1, 2, 10, 11]))
                      <img src="{{ $driverSign }}" width="100%" style="position:absolute; top: -40px; left:5%;">
                    @endif
                  </div>
                  <div style="text-align: center; border-bottom:1px solid #000; font-size:12px;">
                    {{ $vehicle->driver }}
                  </div>
                  <div style="text-align: center; font-size:13px; margin-top:3px;">Driver</div>
                </td>
              </table>
            </td>
          </tr>
          <!-- SPACE -->
          <tr><td colspan="2" height="15"></td></tr>
          {{-- Requestor --}}
          <tr>
            <td colspan="2">
              <table width="50%">
                <tr>
                  <td>
                    <div style="font-size:13px;">
                      <strong>REQUESTED BY:</strong>
                    </div>

                    <div style="border-bottom:1px solid #000; height:35px; text-align:center; position:relative; margin-top:5px;">

                      {{-- Signature --}}
                      @if($requestorSign)
                        <img 
                          src="{{ $requestorSign }}" 
                          style="position:absolute; top:-15px; left:50%; transform:translateX(-50%); z-index:1; width:160px;"
                        >
                      @endif

                      {{-- Name (force above bottom line but below signature) --}}
                      <div style="position:absolute; bottom:2px; width:100%; z-index:2;">
                        <span style="font-size:12px; font-weight:bold;">
                          {{ strtoupper($vehicle->user_name) }}
                        </span>
                      </div>

                    </div>

                    <div style="text-align:center; font-size:12px; margin-top:2px;">
                      {{ $requestor->position }}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- SPACE -->
          <tr><td colspan="2" height="10"></td></tr>
          {{-- Admin or PortManager --}}
          <tr>
            <td colspan="2">
              <table width="50%">
                <tr>
                  <td>
                    <div style="font-size:13px;">
                      <strong>
                        @if($vehicle->admin_approval === 2)
                          APPROVED:
                        @elseif($vehicle->admin_approval === 3)
                          DISAPPROVED:
                        @else
                          APPROVED:
                        @endif
                      </strong>
                    </div>

                    {{-- Esig and name --}}
                    <div style="border-bottom:1px solid #000; height:35px; text-align:center; position:relative;">
                      @if(in_array($vehicle->admin_approval, [1, 2]))
                        @if($vehicle->type_of_slip === 'within')
                        <img src="{{ $adminSign }}" style="position:absolute; top:-15px; left:50%; transform:translateX(-50%); z-index:1; width:160px;">
                        @else
                        <img src="{{ $portmanagerSign }}" style="position:absolute; top:-15px; left:50%; transform:translateX(-50%); z-index:1; width:160px;">
                        @endif
                      @endif

                      {{-- Name (force above bottom line but below signature) --}}
                      <div style="position:absolute; bottom:2px; width:100%; z-index:2;">
                        <span style="font-size:13px; font-weight:bold;">
                          @if($vehicle->type_of_slip === 'within')
                          {{ strtoupper($admin->firstname . ' ' .($admin->middlename ? $admin->middlename . '. ' : '') . $admin->lastname) }}
                          @else
                          {{ strtoupper($pm->firstname . ' ' .($pm->middlename ? $pm->middlename . '. ' : '') . $pm->lastname) }}
                          @endif
                        </span>
                      </div>
                    </div>

                    <div style="text-align:center; font-size:12px; margin-top:2px;">
                      @if($vehicle->type_of_slip === 'within')
                      {{ $admin->position }}
                      @else
                      {{ $pm->position }}
                      @endif
                    </div>

                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- SHARED JOMS FOOTER -->
    <tr>
      <td colspan="2" style="padding-top:10px;">
        <table width="100%">
          <tr>
            <td width="50%" style="position:relative;">
              <div class="pdf-footer joms-fixed">
                Job Order Management System - This is system-generated.
              </div>
            </td>

            <td width="50%" style="position:relative;">
              <div class="pdf-footer joms-fixed">
                Job Order Management System - This is system-generated.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>